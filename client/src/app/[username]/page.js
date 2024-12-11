"use client";

export default function Page({ params }) {
  const { username } = params; // Get the username from the URL parameters

  return (
    <div>
      <h1>Welcome, {username}</h1>
    </div>
  );
}
