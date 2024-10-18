import "dotenv";
import WiseAPI from "wise-api";

const wiseAPI = WiseAPI({
  type: "ORG",
  baseUrl: process.env.WISE_API_BASEURL as string,
  login: process.env.WISE_API_LOGIN as string,
  password: process.env.WISE_API_SECRET as string,
}).catch((error) => {
  console.error(
    "Failed to create WiseAPI instance:",
    JSON.stringify(error, null, 2)
  );
  process.exit(0);
});

export { wiseAPI };
