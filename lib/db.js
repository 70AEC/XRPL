export function getCredentials() {
    const username = process.env.CB_USERNAME;
    const password = process.env.CB_PASSWORD;
  
    if (!username || !password) {
      throw new Error("Missing Couchbase credentials");
    }
  
    return { username, password };
  }
  