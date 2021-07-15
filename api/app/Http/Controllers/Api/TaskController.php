<?php

namespace App\Http\Controllers\Api;

use App\Events\TaskCreatedEvent;
use App\Events\TaskDeleteEvent;
use App\Events\TaskUpdateEvent;
use App\Http\Controllers\Controller;
use App\Jobs\TaskCompleted;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Pusher\Pusher;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::select('id', 'title', 'text', 'notification_date', 'notification_time', 'completed', 'user_id')
            ->with(['user' => fn($user) => $user->select('name', 'id')])
            ->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        if (
            !$request->get('title')
            || !$request->get('text')
            || !$request->get('notification_date')
            || !$request->get('notification_time')
        ) {
            return response()->json([
                'message' => 'Validation error',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $task = new Task([
            'title' => $request->title,
            'text' => $request->text,
            'notification_date' => $request->notification_date,
            'notification_time' => $request->notification_time,
            'user_id' => $request->user()->id,
        ]);

        $task->save();

        event(new TaskCreatedEvent($task));
        dispatch(new TaskCompleted($task));

        return response()->json(
            $task->toArray(),
            \Illuminate\Http\Response::HTTP_CREATED,
        );
    }

    public function update(Request $request, $id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json([
                'message' => 'Not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $availableAttrs = ['title', 'text'];
        foreach ($request->all() as $attr => $value) {
            if (in_array($attr, $availableAttrs)) {
                $task->{$attr} = $value;
            }
        }

        $task->save();
        event(new TaskUpdateEvent($task));
        return response()->json($task->toArray(), Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json([
                'message' => 'Not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $task->delete();
        event(new TaskDeleteEvent($task->id));
        return response()->json([
            'message' => 'Deleted'
        ], Response::HTTP_OK);
    }
}
