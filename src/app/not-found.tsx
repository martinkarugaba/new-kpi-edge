import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-xl font-normal">
      <h1 className="text-6xl font-semibold">404 Page not found!</h1>
      <p className="">Below are some helpful links;</p>
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/">Home page</Link>
        <Link href="/dashboard/participants">Participants</Link>
      </div>
    </div>
  );
};
export default NotFound;
