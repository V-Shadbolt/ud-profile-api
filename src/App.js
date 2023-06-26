import GetMessage from "./ProfileManagement";
import udLogo from "./assets/ud-logo-lockup.svg"

export default function App() {
  return (
    <div className="flex w-1/2 mx-auto">
      <div>
        <img src={udLogo} style={{ height: 100, width: 200}} alt="udlogo"/>
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-[#0A3783] text-center">
            Unstoppable Domains Profile API Demo
          </h1>
          <div className="mt-5">
              <p> The Profile API can manage user owned domains without the need to visit Unstoppable Domains. Check it out below to see what's possible! </p>
              <h3 className="mt-5 text-[#0A3783] font-semibold">
                <a className="hover:text-[#0D67FE]" href="https://docs.unstoppabledomains.com/openapi/profile-v1/">Full Documentation</a>
              </h3>
          </div>
        </div>
        <GetMessage />
      </div>
    </div>
  );
}
