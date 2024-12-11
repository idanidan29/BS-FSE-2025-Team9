"use client";
import { use } from 'react';

export default function Page({ params }) {
  const { username } = use(params);

  return (
    <div>
      <h1>Welcome, {username}</h1>
    </div>
  );
}
