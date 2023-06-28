import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import axios from "axios";

const getMessage = async ({ setError, domain, requestBody }) => {
  try {
    const url = 'https://profile.unstoppabledomains.com/api/user/' + domain + '/signature?expiry=1765522015090'
    const responseBody = await axios({
      method: 'post',
      url: url,
      data: requestBody,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    var jsonResponse = responseBody?.data?.message;
    return jsonResponse;
  } catch (err) {
    console.log(err?.message)
    if (err?.message?.includes("400")) {
      setError("Malformed JSON")
    } else {
      setError(err?.message)
    }
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
    setError(err?.message);
  }
};

const setRecords = async ({ setError, domain, signature, requestBody }) => {
  try {
    const url = 'https://profile.unstoppabledomains.com/api/user/' + domain
    const responseBody = await axios({
      method: 'post',
      url: url,
      data: requestBody,
      headers: {
        'Accept': 'application/json',
        'x-auth-domain': domain,
        'x-auth-expires': '1765522015090',
        'x-auth-signature': signature,
        'Content-Type': 'application/json'
      },
    })
    return responseBody?.data;
  } catch (err) {
    console.log(err?.message)
    if (err?.message?.includes("403")) {
      setError("Domain not owned by signature wallet")
    } else {
      setError(err?.message)
    }
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
    <div>
      <form className="m-1" onSubmit={handleRecord}>
        <div className="w-full mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-2xl text-[#202020] text-center">
              Profile Management
            </h1>
            <div>
              <div className="my-3">
                <textarea
                  required
                  type="text"
                  name="domain"
                  className="textarea w-full h-24 textarea-bordered focus:ring ring-[#0D67FE] focus:outline-none"
                  placeholder="johndoe.x"
                />
              </div>
              <div className="my-3">
                <textarea
                  required
                  type="text"
                  name="request"
                  className="textarea w-full h-24 textarea-bordered focus:ring ring-[#0D67FE] focus:outline-none"
                  placeholder=' 
                  {
                    "displayName": "John Doe"
                  }
                  '
                  
                />
              </div>
            </div>
          </main>
          <footer className="my-3 p-4">
            <button
              type="submit"
              className="bg-[#0D67FE] text-white rounded-full focus:ring focus:outline-none w-full"
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
    </div>
  );
}
