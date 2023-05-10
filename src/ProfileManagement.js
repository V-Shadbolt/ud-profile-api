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

const signMessage = async ({ setSignError, message }) => {
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
    setSignError(err.message);
  }
};

const setRecords = async ({ setRecordError, domain, signature, requestBody }) => {
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
    setRecordError(err.message);
  }
};

export default function ProfileManagement() {
  const [successMsg, setSuccessMsg] = useState();
  const [error, setError] = useState();
  const [signature, setSignature] = useState();
  const [signError, setSignError] = useState();
  const [record, setRecord] = useState();
  const [recordError, setRecordError] = useState();

  const handleMessage = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setSuccessMsg();
    setError();
    const response = await getMessage({
      setError,
      domain: data.get("domain"),
      requestBody: data.get("request")
    });

    if (response) {
      console.log(response)
      setSuccessMsg(response);
    }
  };

  const handleSign = async (e) => {
    e.preventDefault();
    setSignature();
    setSignError();
    const sig = await signMessage({
      setSignError,
      message: successMsg
    });
    if (sig) {
      console.log(sig.signature)
      setSignature(sig);
    }
  };

  const handleRecord = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setRecord();
    setRecordError();
    const response = await setRecords({
      setRecordError,
      domain: data.get("domain"),
      signature: signature.signature,
      requestBody: data.get("request")
    });

    if (response.profile) {
      console.log(response)
      setRecord(`200`);
    }
  };

  return (
    <form className="m-4" onSubmit={signature ? handleRecord : successMsg ? handleSign : handleMessage}>
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
            Get Message
          </button>
          <div className="p-4 mt-4">
            <ErrorMessage message={error} />
            <SuccessMessage message={successMsg} />
          </div>
        </footer>
      </div>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Sign message
          </button>
          <ErrorMessage message={signError} />
          <SuccessMessage message={signature?.signature} />
        </footer>
      </div>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Set Record
          </button>
          <ErrorMessage message={recordError} />
          <SuccessMessage message={record} />
        </footer>
      </div>
    </form>

  );
}
