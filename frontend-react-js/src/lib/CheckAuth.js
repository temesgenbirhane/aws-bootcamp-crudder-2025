import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const checkAuth = async (setUser) => {
  try {
    // getCurrentUser throws if not signed in
    const user = await getCurrentUser();
    console.log("user", user);

    // fetchAuthSession gives access token + claims
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;

    setUser({
      display_name: idToken?.payload?.name,
      handle: idToken?.payload?.preferred_username
    });

  } catch (err) {
    console.log(err);
  }
};

export default checkAuth;