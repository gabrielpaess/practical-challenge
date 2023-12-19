import { RequestHandler } from "express";
import TaskModel from "../models/task";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getTasks: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const tasks = await TaskModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

export const getTask: RequestHandler = async (req ,res, next) => {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid task id");
        }

        const task = await TaskModel.findById(taskId).exec();

        if (!task) {
            throw createHttpError(404, "Task not found");
        }

        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task");
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

interface CreateTaskBody {
    title?: string,
    text?: string,
}

export const createTask: RequestHandler <unknown, unknown, CreateTaskBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if(!title) {
            throw createHttpError(400, "Task must have a title");
        }

        const newTask = await TaskModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
        });

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

interface UpdateTaskParams {
    taskId: string,
}

interface UpdateTaskBody {
    title?: string,
    text?: string,
}

export const updateTask: RequestHandler<UpdateTaskParams, unknown, UpdateTaskBody, unknown> = async(req, res, next) => {
    const taskId = req.params.taskId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid task id");
        }

        if(!newTitle) {
            throw createHttpError(400, "Task must have a title");
        }

        const task = await TaskModel.findById(taskId).exec();

        if (!task) {
            throw createHttpError(404, "Task not found");
        }

        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task");
        }

        task.title = newTitle;
        task.text = newText;

        const updatedTask = await task.save();

       res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

export const deleteTask: RequestHandler = async(req, res, next) => {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid task id");
        }

        const task = await TaskModel.findById(taskId).exec();

        if (!task) {
            throw createHttpError(404, "Task not found");
        }

        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task");
        }

        await task.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}