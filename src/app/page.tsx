import { ProfilePage } from "@/components/ProfilePage";
import { links, profile } from "@/data/links";

export default function Home() {
  return <ProfilePage profile={profile} links={links} />;
}
