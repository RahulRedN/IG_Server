const Query = require("../models/Query");

const postQuery = async (req, res) => {
  try {
    const { name, email, subject, phone, message } = req.body;
    const query = new Query({ name, email, subject, phone, message });
    await query.save();
    res.status(201).json({ message: "Query posted successfully" });
  } catch (error) {
    console.error("Error posting query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const ignoreQuery = async (req, res) => {
    try {
      const { id } = req.body;
      console.log(id);
      const query = await Query.findByIdAndDelete(id);
      if (!query) {
        return res.status(404).json({ error: "Query not found" });
      }
      res.status(200).json({ message: "Query ignored successfully" });
    } catch (error) {
      console.error("Error ignoring query:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

module.exports = {
  postQuery,
  ignoreQuery,
};
