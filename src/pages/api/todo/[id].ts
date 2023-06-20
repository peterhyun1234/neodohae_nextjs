import type { NextApiRequest, NextApiResponse } from 'next';

type Todo = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

const todos: Todo[] = [
    { id: '1', title: 'Todo 1', content: 'This is todo 1', createdAt: new Date().toISOString() },
    { id: '2', title: 'Todo 2', content: 'This is todo 2', createdAt: new Date().toISOString() },
    { id: '3', title: 'Todo 3', content: 'This is todo 3', createdAt: new Date().toISOString() },
    { id: '4', title: 'Todo 4', content: 'This is todo 4', createdAt: new Date().toISOString() },
    { id: '5', title: 'Todo 5', content: 'This is todo 5', createdAt: new Date().toISOString() },
    { id: '6', title: 'Todo 6', content: 'This is todo 6', createdAt: new Date().toISOString() },
    { id: '7', title: 'Todo 7', content: 'This is todo 7', createdAt: new Date().toISOString() },
    { id: '8', title: 'Todo 8', content: 'This is todo 8', createdAt: new Date().toISOString() },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Adding 2 seconds delay
        res.status(400).json({ message: 'Todo not found' });
        return;
    }

    res.status(200).json(todo);
}
