'use client';

const verifyEmail = async () => {
  try {
    const response = await fetch('/api/verify');
    const data = await response.json();
    console.log("verified")
  } catch (error) {
    console.error('Failed to verify email:', error);
  }
}

export default function VerifyButton() {
  return (
    <button onClick={verifyEmail}>click me</button>
  );
}