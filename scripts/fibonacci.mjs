const AUTH_API_URL = `http://localhost:3000/graphql`;
const LOGIN_MUTATION = `
mutation Login($loginInput: LoginInput!){
login(loginInput: $loginInput) {
  id
  email
  }
}
`;
const JOBS_API_URL = `http://localhost:3001/graphql`;
const EXECUTE_JOB_MUTATION = `
mutation ExecuteJob($executeJobInput: ExecuteJobInput!) {
executeJob(executeJobInput: $executeJobInput) {
name
  }
}
`;

async function Login(email, password) {
  const response = await fetch(AUTH_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: LOGIN_MUTATION,
      variables: { loginInput: { email, password } },
    }),
  });
  const data = await response.json();
  const cookie = response.headers.get('set-cookie');
  return { data, cookie };
}
async function executeJobWithInput(executeJobInput, cookies) {
  const response = await fetch(JOBS_API_URL, {
    method: 'POST',
    headers: { 'Content-type': 'application/json', Cookie: cookies },
    body: JSON.stringify({
      query: EXECUTE_JOB_MUTATION,
      variables: { executeJobInput },
    }),
  });
  const data = await response.json();
  return data;
}

(async () => {
  try {
    const { data: loginData, cookie } = await Login(
      'newuser@example.com',
      'securePass123!'
    );

    if (!loginData?.data?.login?.id) {
      console.error('Login failed:', JSON.stringify(loginData, null, 2));
      return;
    }

    const n = 1000;
    console.log(`Executing Fibonacci with n = ${n}`);
    const executeJobInput = {
      name: 'Fibonacci',
      data: Array.from({ length: n }, () => ({
        iterations: Math.floor(Math.random() * 5000) + 1,
      })),
    };
    const data = await executeJobWithInput(executeJobInput, cookie);
    console.log(data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
})();
