const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User").default;
const Project = require("../models/Project").default;
const Task = require("../models/Task").default;

const users = [
  { name: "Aarav Sharma", email: "aarav.sharma@example.com", password: "password123" },
  { name: "Priya Nair", email: "priya.nair@example.com", password: "password123" },
  { name: "Rohan Mehta", email: "rohan.mehta@example.com", password: "password123" },
  { name: "Ananya Iyer", email: "ananya.iyer@example.com", password: "password123" },
  { name: "Kabir Khan", email: "kabir.khan@example.com", password: "password123" }
];

const futureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Promise.all([
      Task.deleteMany({}),
      Project.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log("Old data removed");

    const createdUsers = [];

    for (const user of users) {
      createdUsers.push(await User.create(user));
    }
    const [aarav, priya, rohan, ananya, kabir] = createdUsers;
    console.log("Users created");

    const projects = await Project.insertMany([
      {
        name: "Mumbai Launch Plan",
        description: "Coordinate launch tasks for the western region rollout.",
        admin: aarav._id,
        members: [aarav._id, priya._id, rohan._id]
      },
      {
        name: "Bengaluru Product Sprint",
        description: "Build and review the new task analytics workflow.",
        admin: priya._id,
        members: [priya._id, ananya._id, kabir._id]
      },
      {
        name: "Delhi Client Onboarding",
        description: "Prepare onboarding material and implementation checklist.",
        admin: rohan._id,
        members: [rohan._id, aarav._id, ananya._id]
      }
    ]);
    const [mumbaiLaunch, bengaluruSprint, delhiOnboarding] = projects;
    console.log("Projects created");

    await Task.insertMany([
      {
        title: "Finalize launch checklist",
        description: "Confirm owners, deadlines, and dependencies for launch day.",
        dueDate: futureDate(3),
        priority: "High",
        status: "In Progress",
        assignedTo: priya._id,
        project: mumbaiLaunch._id,
        createdBy: aarav._id
      },
      {
        title: "Prepare vendor follow-ups",
        description: "Send follow-up emails to venue and logistics vendors.",
        dueDate: futureDate(5),
        priority: "Medium",
        status: "To Do",
        assignedTo: rohan._id,
        project: mumbaiLaunch._id,
        createdBy: aarav._id
      },
      {
        title: "Review analytics cards",
        description: "Validate totals, status grouping, and overdue task counts.",
        dueDate: futureDate(2),
        priority: "High",
        status: "In Progress",
        assignedTo: ananya._id,
        project: bengaluruSprint._id,
        createdBy: priya._id
      },
      {
        title: "Write sprint demo notes",
        description: "Summarize completed work and open product questions.",
        dueDate: futureDate(7),
        priority: "Low",
        status: "To Do",
        assignedTo: kabir._id,
        project: bengaluruSprint._id,
        createdBy: priya._id
      },
      {
        title: "Create onboarding deck",
        description: "Draft the first client onboarding presentation.",
        dueDate: futureDate(-2),
        priority: "Medium",
        status: "To Do",
        assignedTo: aarav._id,
        project: delhiOnboarding._id,
        createdBy: rohan._id
      },
      {
        title: "Confirm implementation timeline",
        description: "Align milestone dates with the client success team.",
        dueDate: futureDate(4),
        priority: "High",
        status: "Done",
        assignedTo: ananya._id,
        project: delhiOnboarding._id,
        createdBy: rohan._id
      }
    ]);
    console.log("Tasks created");

    console.log("Seeded login users:");
    console.table(
      createdUsers.map((user) => ({
        name: user.name,
        email: user.email,
        password: "password123"
      }))
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
