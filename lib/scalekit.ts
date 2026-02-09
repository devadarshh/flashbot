import { Scalekit } from "@scalekit-sdk/node";

let _scalekit: Scalekit | null = null;

const getScalekit = () => {
  if (!_scalekit) {
    const environmentUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

    if (!environmentUrl || !clientId || !clientSecret) {
      throw new Error(
        "Missing Scalekit credentials. Please set SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, and SCALEKIT_CLIENT_SECRET environment variables."
      );
    }

    _scalekit = new Scalekit(environmentUrl, clientId, clientSecret);
  }
  return _scalekit;
};

export default getScalekit;
