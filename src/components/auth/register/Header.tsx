import AuthHeader from "@/components/shared/molecular/AuthHeader";
import React from "react";

const Header = () => {
  return (
    <AuthHeader
      header="Sign In"
      subheader={
        <div className="text-center mb-5">
          Sign in to access and write blogs and connect with your <br />
          favourite bloggers.
        </div>
      }
    />
  );
};

export default Header;
