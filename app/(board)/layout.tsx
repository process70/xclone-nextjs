import "../globals.css";
import LeftBar from "../component/LeftBar";
import RightBar from "../component/RightBar";

export default function BoardLayout({
  children,
  model,
}: Readonly<{
  children: React.ReactNode;
  model: React.ReactNode;
}>) {
  return (
    <div
      className="md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl 
          flex justify-between mx-auto"
    >
      <div className="px-2 xsm:px-4 xxl:px-8">
        <LeftBar />
      </div>
      {/* flex-1: make the children grow and fill available space 
          of the left and right */}
      <div className="border-x-[1px] border-x-borderGray lg:w-[640px]">
        {children}
        {model}
      </div>
      {/* flex-1 take the available spaces from the children */}
      <div className="pb-6 hidden lg:flex lg:flex-1 ml-4 md:ml-6">
        <RightBar />
      </div>
    </div>
  );
}
