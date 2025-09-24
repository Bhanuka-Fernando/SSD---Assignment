const express = require('express');
const Admin = require('./models/Admin');
const Doctor = require('./models/Doctor');

const OIDC_ISSUER   = process.env.OIDC_ISSUER || 'https://accounts.google.com';
const CLIENT_ID     = process.env.OIDC_CLIENT_ID;
const CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET;
const REDIRECT_URI  = process.env.OIDC_REDIRECT_URI || 'http://localhost:8070/auth/callback';


const FRONTEND_URL  = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const router = express.Router();


let oc, config;
async function ensureDiscovered() {
  if (config && oc) return { oc, config };
  const raw = await import('openid-client');
  oc = raw?.default ?? raw; 

  // v7-style: provide URL + client credentials
  config = await oc.discovery(new URL(OIDC_ISSUER), CLIENT_ID, CLIENT_SECRET);
  return { oc, config };
}

// GET /auth/login?role=admin|doctor
router.get('/login', async (req, res, next) => {
  try {
    const role = String(req.query.role || '').toLowerCase();
    if (!['admin','doctor'].includes(role)) return res.status(400).send('invalid role');
    req.session.requestedRole = role;

    const { oc, config } = await ensureDiscovered();

    // PKCE + state/nonce
    const code_verifier  = oc.randomPKCECodeVerifier();
    const code_challenge = await oc.calculatePKCECodeChallenge(code_verifier);
    const state = oc.randomState();
    const nonce = oc.randomNonce();

    // keep in session
    req.session.code_verifier = code_verifier;
    req.session.state = state;
    req.session.nonce = nonce;

    // Build authorization URL
    const authUrl = oc.buildAuthorizationUrl(config, {
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: 'openid email profile',
      response_type: 'code',
      code_challenge,
      code_challenge_method: 'S256',
      state,
      nonce,
    });

    res.redirect(authUrl.href);
  } catch (err) {
    next(err);
  }
});

// GET /auth/callback
// GET /auth/callback
router.get('/callback', async (req, res, next) => {
  try {
    const { oc, config } = await ensureDiscovered();

    const currentUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    const clientAuthentication = new oc.ClientSecretPost(CLIENT_ID, CLIENT_SECRET);

    const tokenResponse = await oc.authorizationCodeGrant(
      config,
      currentUrl,
      {
        clientAuthentication,
        pkceCodeVerifier: req.session.code_verifier,
        expectedState: req.session.state,
        expectedNonce: req.session.nonce,
        expectedAudience: CLIENT_ID,
      }
    );

    if (!tokenResponse.id_token) {
      throw new Error('No id_token in token response');
    }

    const [, payloadB64] = tokenResponse.id_token.split('.');
    const claimsJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const claims = JSON.parse(claimsJson);

    const email = (claims.email || '').toLowerCase();
    const chosenRole = req.session.requestedRole;

    if (chosenRole === 'admin') {
      const admin = await Admin.findOne({ email, roleName: 'admin' }).lean();
      if (!admin) {
        console.log('This Google account is not an approved Admin');
        req.session.destroy(() => res.status(403).send('Admin verification failed'));
        return;
      }
    }

    if (chosenRole === 'doctor') {
      const doctor = await Doctor.findOne({ email }).lean();
      if (!doctor) {
        console.log('This Google account is not an approved Doctor');
        req.session.destroy(() => res.status(403).send('Doctor verification failed'));
        return;
      }
    }

    req.session.user = {
      sub: claims.sub,
      email,
      name: claims.name,
      role: chosenRole,
    };

    const destByRole = {
      admin: `${FRONTEND_URL}/admindashboard`,
      doctor: `${FRONTEND_URL}/doctorDashboard`,
    };

    res.redirect(destByRole[chosenRole] || FRONTEND_URL);
  } catch (err) {
    console.error('OIDC callback error:', err);
    res.status(500).send(String(err));
  }
});



router.get('/me', (req, res) => {
  if (!req.session?.user) return res.status(401).json({ error: 'unauthenticated' });
  res.json({ user: req.session.user });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.status(204).end());
});

module.exports = router;
