import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col text-xl font-normal justify-center items-center min-h-screen gap-6">
      <h1 className="text-6xl font-semibold">404 Page not found!</h1>
      <p className="">Below are some helpful links;</p>
      <div className="flex justify-between items-center gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/">Home page</Link>
        <Link href="/dashboard/participants">Participants</Link>
      </div>
    </div>
  );
};
export default NotFound;
