import { getUserProfile ,updateUserProfile, getPublicUserProfile ,getListingsByUser} from "../models/userModel.js";

export const getProfile = (req, res) => {
  const userId = req.user.id;

  getUserProfile(userId, (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  });
};

export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { full_name, location, avatar_initials } = req.body;

  if (!full_name && !location && !avatar_initials) {
  return res.status(400).json({ message: "No data to update" });
}
  updateUserProfile(userId, full_name, location, avatar_initials, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Profile updated successfully" });
  });
};


export const getPublicProfile = (req, res) => {
  const userId = req.params.userId;

  getPublicUserProfile(userId, (err, result) => {
    if (err) return res.status(500).json(err);

   if (!result) {
  return res.status(404).json({ message: "User not found" });
}

    res.json(result);
  });
};


export const getUserListings = (req, res) => {
  const userId = req.params.userId;

  getListingsByUser(userId, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};