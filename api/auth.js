export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const redirectUri = `${protocol}://${host}/api/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&scope=repo,user&redirect_uri=${redirectUri}`;
  res.redirect(url);
}
