import { Redirect } from 'expo-router';

// This route is not used in FonoFútbol; redirect to home.
export default function Explore() {
  return <Redirect href="/" />;
}
