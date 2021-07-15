<?php


namespace App\Http\Controllers\Api;

use App\Models\TaskSeen;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SeenController extends \App\Http\Controllers\Controller
{
    public function store(Request $request)
    {
        if (!$request->get('task_id')) {
            return response()->json([
                'message' => 'task id should be specified',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $seen = new TaskSeen([
            'user_id' => $request->user()->id,
            'task_id' => $request->get('task_id')
        ]);
        $seen->save();
        return response()->json(
            $seen->toArray(),
            Response::HTTP_CREATED
        );
    }
}
