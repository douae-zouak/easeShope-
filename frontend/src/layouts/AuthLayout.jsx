import FloatingShape from "../components/FloatingShape";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1723] via-[#1C66BB] to-[#324E71] flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-[#6a9bd7]"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-[#6a9bd7]"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-[#6a9bd7]"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {children}
    </div>
  );
};

export default AuthLayout;
