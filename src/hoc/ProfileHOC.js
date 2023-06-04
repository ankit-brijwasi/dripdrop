import { Query } from "appwrite";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { useAuth } from "../hooks/useAuth";
import { databases } from "../appwrite/config";
import { processProfileImg } from "../utils/helpers";

import Loading from "../components/Loading";

export default function ProfileHoc(WrappedComponent) {
  function Component({ myProfile }) {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const { userId } = useParams();
    const [auth] = useAuth();

    const uId = userId ? userId : auth.user.$id;

    // fetch profile
    useEffect(() => {
      (async () => {
        try {
          const profile = await databases.listDocuments(
            process.env.REACT_APP_DATABASE_ID,
            process.env.REACT_APP_PROFILE_COLLECTION_ID,
            [Query.equal("user_id", uId)]
          );
          if (profile.documents.length > 0) {
            const doc = profile.documents[0];
            doc.profile_image = processProfileImg(doc.profile_image);
            doc.followers = doc.followers.filter(Boolean);
            doc.following = doc.following.filter(Boolean);
            setProfile(doc);
          }
        } catch (error) {
          toast(error.response.message, { type: "error" });
        }
        setLoading(false);
      })();
    }, [userId, uId]);

    return (
      <Container maxWidth="lg" sx={{ mx: "auto", marginTop: 9 }}>
        <Box sx={{ paddingY: 1 }}>
          {loading ? (
            <Loading message={"Loading profile..."} />
          ) : (
            <WrappedComponent userId={uId} me={myProfile} profile={profile} />
          )}
        </Box>
      </Container>
    );
  }

  return Component;
}
