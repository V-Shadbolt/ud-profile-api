import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const getMessage = async ({ setError, domain, requestBody }) => {
  try {
    const url = 'https://profile.unstoppabledomains.com/api/user/' + domain + '/signature?expiry=1765522015090'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: requestBody
    })
    const responseBody = await response.json()
    var jsonResponse = responseBody.message;
    return jsonResponse;
  } catch (err) {
    setError(err.message);
  }
};

const signMessage = async ({ setError, message }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address
    };
  } catch (err) {
    setError(err.message);
  }
};

const setRecords = async ({ setError, domain, signature, requestBody }) => {
  try {
    const url = 'https://profile.unstoppabledomains.com/api/user/' + domain
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-auth-domain': domain,
        'x-auth-expires': '1765522015090',
        'x-auth-signature': signature,
        'Content-Type': 'application/json'
      },
      body: requestBody
    })
    const responseBody = await response.json()
    return responseBody;
  } catch (err) {
    setError(err.message);
  }
};

export default function ProfileManagement() {
  const [success, setSuccess] = useState();
  const [error, setError] = useState();

  const handleRecord = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setSuccess();
    setError();

    const message = await getMessage({
      setError,
      domain: data.get("domain"),
      requestBody: data.get("request")
    });

    if (message) {
      console.log("Signing Message: \n" + message)

      const sig = await signMessage({
        setError,
        message: message
      });
  
      if (sig) {
        console.log("Signature: \n" + sig.signature)

        const response = await setRecords({
          setError,
          domain: data.get("domain"),
          signature: sig.signature,
          requestBody: data.get("request")
        });
    
        if (response.profile) {
          console.log("Profile Metadata: \n")
          console.log(response)
          setSuccess("Profile Updated");
        }
      } 
    } 
  };

  return (
    <form className="m-1" onSubmit={handleRecord}>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Profile Management
          </h1>
          <div className="">
            <div className="my-3">
              <textarea
                required
                type="text"
                name="domain"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Domain Name"
              />
            </div>
            <div className="my-3">
              <textarea
                required
                type="text"
                name="request"
                className="textarea w-full h-24 textarea-bordered focus:ring focus:outline-none"
                placeholder="Request Body JSON"
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Set Record
          </button>
          <div className="p-4 mt-4">
            <ErrorMessage message={error} />
            <SuccessMessage message={success} />
          </div>
        </footer>
      </div>
    </form>

  );
}
