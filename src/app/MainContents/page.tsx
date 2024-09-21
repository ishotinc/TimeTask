'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Button } from "@/app/_components/button"
import { Card, CardHeader, CardContent } from "@/app/_components/card"
import { Input } from "@/app/_components/input"
import { Plus, Play, Square,  X,  GripVertical, Edit, Trash2, ChevronDown, Crown } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/app/_components/avatar"
import { Badge } from "@/app/_components/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/dialog"
import { Textarea } from "@/app/_components/textarea"
import { Checkbox } from "@/app/_components/checkbox"
import { Label } from "@/app/_components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/select"
import {Task,Column,TaskCardProps,TaskListProps,TaskModalProps,PersistentHeaderProps} from "@/app/_types/type"

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'タスク1', labels: ['重要', '緊急'], assignee: 'John', timeSpent: 0, checklist: [], comments: [], weeklyTotal: 3600, monthlyTotal: 7200, weeklyBestRecord: 0, monthlyBestRecord: 0 },
    'task-2': { id: 'task-2', content: 'タスク2', labels: ['低優先', '長期'], assignee: 'Jane', timeSpent: 0, checklist: [], comments: [], weeklyTotal: 1800, monthlyTotal: 3600, weeklyBestRecord: 0, monthlyBestRecord: 0 },
    'task-3': { id: 'task-3', content: 'タスク3', labels: ['中優先', '短期'], assignee: 'Bob', timeSpent: 0, checklist: [], comments: [], weeklyTotal: 2700, monthlyTotal: 5400, weeklyBestRecord: 0, monthlyBestRecord: 0 },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: '未着手',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: '進行中',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: '完了',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
}

const labelColors = {
  '重要': 'bg-[#37AB9D] text-white',
  '緊急': 'bg-[#4DC0B2] text-white',
  '中優先': 'bg-[#FFC042] text-black',
  '低優先': 'bg-[#586365] text-white',
  '長期': 'bg-[#586365] text-white',
  '短期': 'bg-[#FFC042] text-black',
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEditTask, onOpenTaskModal, onStartTimer, onStopTimer, isActive }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(task?.content || '')
  const [editingLabelIndex, setEditingLabelIndex] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState('')
  const [isWeeklyView, setIsWeeklyView] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isActive) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive])

  const handleContentClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      onEditTask(task.id, { content })
    }
  }

  const handleContentBlur = () => {
    setIsEditing(false)
    onEditTask(task.id, { content })
  }

  const handleLabelClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.stopPropagation()
    setEditingLabelIndex(index)
    setEditingLabel(task.labels[index])
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLabel(e.target.value)
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      const newLabels = [...task.labels]
      newLabels[index] = editingLabel
      onEditTask(task.id, { labels: newLabels })
      setEditingLabelIndex(null)
    }
  }

  const handleLabelBlur = (index: number) => {
    const newLabels = [...task.labels]
    newLabels[index] = editingLabel
    onEditTask(task.id, { labels: newLabels })
    setEditingLabelIndex(null)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const toggleTimeView = () => {
    setIsWeeklyView(!isWeeklyView)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleDeleteClick = () => {
    // Implement delete functionality
  }

  const getBestRecord = () => {
    if (isWeeklyView) {
      return task.weeklyBestRecord > 0 ? task.weeklyBestRecord : task.weeklyTotal + currentTime
    } else {
      return task.monthlyBestRecord > 0 ? task.monthlyBestRecord : task.monthlyTotal + currentTime
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-full bg-white relative mb-2"
        >
          <div
            {...provided.dragHandleProps}
            className="absolute top-0 left-0 bottom-0 w-6 flex items-center justify-center cursor-move hover:bg-gray-100 group"
          >
            <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
          </div>
          <div className="pl-6 py-1">
            <CardHeader className="p-1">
              <div className="flex items-center justify-between mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{task.assignee ? task.assignee[0] : '?'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-1 flex-grow mx-2">
                  {task.labels && task.labels.map((label: string, i: number) => (
                    <Badge
                      key={i}
                      className={`cursor-pointer text-xs ${labelColors[label as keyof typeof labelColors] || 'bg-gray-200 text-gray-800'}`}
                      onClick={(e: React.MouseEvent<HTMLElement>) => handleLabelClick(e, i)}
                    >
                      {editingLabelIndex === i ? (
                        <Input
                          value={editingLabel}
                          onChange={handleLabelChange}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleLabelKeyDown(e, i)}  
                          onBlur={() => handleLabelBlur(i)}
                          autoFocus
                          className="w-20 h-6 p-1 text-xs"
                          onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
                        />
                      ) : (
                        label
                      )}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleEditClick}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    aria-label="タスクを編集"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={handleDeleteClick}
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    aria-label="タスクを削除"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm flex-grow">
                  {isEditing ? (
                    <Input
                      value={content}
                      onChange={handleContentChange}
                      onKeyDown={handleContentKeyDown}
                      onBlur={handleContentBlur}
                      autoFocus
                      onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
                      className="text-sm p-1 h-7"
                    />
                  ) : (
                    <span onClick={handleContentClick}>{content}</span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-1">
              <div className="text-xs flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={toggleTimeView}
                    variant="outline"
                    size="sm"
                    className="p-1 h-6 text-xs flex items-center gap-1 border-dashed"
                  >
                    {isWeeklyView ? 'W' : 'M'}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <div className="flex items-center">
                    <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                    <span>{formatTime(getBestRecord())}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="whitespace-nowrap">
                    累計: {formatTime(isWeeklyView ? task.weeklyTotal + currentTime : task.monthlyTotal + currentTime)}
                  </span>
                  <Button
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation()
                      isActive ? onStopTimer() : onStartTimer(task.id)
                    }}
                    variant="ghost"
                    size="sm"
                    className={`p-0 h-6 w-6 rounded-full ${isActive ? 'bg-[#f14134]' : 'bg-[#f14134] bg-opacity-20'} hover:bg-[#f14134] hover:bg-opacity-30`}
                    aria-label={isActive ? "タイマーを停止" : "タイマーを開始"}
                  >
                    {isActive ? <Square className="h-3 w-3 text-white" /> : <Play className="h-3 w-3 text-[#f14134]" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </Draggable>
  )
}

const TaskList: React.FC<TaskListProps> = ({ column, tasks, index, onEditListTitle, onAddTask, onEditTask, onOpenTaskModal, onStartTimer, onStopTimer, activeTaskId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(column.title)

  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    onEditListTitle(column.id, title)
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="w-80"
        >
          <Card className="bg-white">
            <CardHeader {...provided.dragHandleProps} className="py-2">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  autoFocus
                />
              ) : (
                <h2 className="font-semibold cursor-pointer" onClick={handleTitleClick}>
                  {column.title}
                </h2>
              )}
            </CardHeader>
            <CardContent className="py-1">
              <Button
                onClick={() => onAddTask(column.id)}
                className="w-full mb-2 bg-gray-100 hover:bg-gray-200 text-gray-600"
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Droppable droppableId={column.id} type="task">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {tasks.map((task, index: number) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={index}
                        onEditTask={onEditTask}
                        onOpenTaskModal={onOpenTaskModal}
                        onStartTimer={onStartTimer}
                        onStopTimer={onStopTimer}
                        isActive={task.id === activeTaskId}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onUpdate }) => {
  const [editedTask, setEditedTask] = useState(task)
  const [newLabel, setNewLabel] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedTask({ ...editedTask, [name]: value })
  }

  const handleChecklistChange = (index: number, value: boolean) => { 
    const newChecklist = [...editedTask.checklist]
    newChecklist[index] = { ...newChecklist[index], completed: value }
    setEditedTask({ ...editedTask, checklist: newChecklist })
  }

  const handleAddChecklistItem = () => {
    setEditedTask({
      ...editedTask,
      checklist: [...editedTask.checklist, { text: '', completed: false }],
    })
  }

  const handleChecklistItemTextChange = (index: number, value: string) => { 
    const newChecklist = [...editedTask.checklist]
    newChecklist[index] = { ...newChecklist[index], text: value }
    setEditedTask({ ...editedTask, checklist: newChecklist })
  }

  const handleAddComment = () => {
    setEditedTask({
      ...editedTask,
      comments: [...editedTask.comments, { text: '', author: 'User', timestamp: new Date().toISOString() }],
    })
  }

  const handleCommentChange = (index: number, value: string) => { 
    const newComments = [...editedTask.comments]
    newComments[index] = { ...newComments[index], text: value }
    setEditedTask({ ...editedTask, comments: newComments })
  }

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      setEditedTask({
        ...editedTask,
        labels: [...editedTask.labels, newLabel.trim()],
      })
      setNewLabel('')
    }
  }

  const handleRemoveLabel = (index: number) => {  
    const newLabels = [...editedTask.labels]
    newLabels.splice(index, 1)
    setEditedTask({ ...editedTask, labels: newLabels })
  }

  const handleSave = () => {
    onUpdate(editedTask)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>タスク詳細</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              タイトル
            </Label>
            <Input
              id="title"
              name="content"
              value={editedTask.content}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">
              担当者
            </Label>
            <Input
              id="assignee"
              name="assignee"
              value={editedTask.assignee}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div>
            <Label>ラベル</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedTask.labels.map((label, index) => (
                <Badge
                  key={index}
                  className={`${labelColors[label as keyof typeof labelColors] || 'bg-gray-200 text-gray-800'} flex items-center`}
                >
                  {label}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => handleRemoveLabel(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex mt-2">
              <Input
                value={newLabel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLabel(e.target.value)}  
                placeholder="新しいラベル"
                className="mr-2"
              />
              <Button onClick={handleAddLabel} className="bg-[#37AB9D] text-white hover:bg-[#4DC0B2]">追加</Button>
            </div>
          </div>
          <div>
            <Label>チェックリスト</Label>
            {editedTask.checklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Checkbox
                  checked={item.completed}
                  onChange={(event) => handleChecklistChange(index, event.target.checked)}
                />
                <Input
                  value={item.text}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChecklistItemTextChange(index, e.target.value)}
                />
              </div>
            ))}
            <Button onClick={handleAddChecklistItem} variant="outline" size="sm" className="mt-2">
              項目を追加
            </Button>
          </div>
          <div>
            <Label>コメント</Label>
            {editedTask.comments.map((comment, index) => (
              <div key={index} className="mt-2">
                <Textarea
                  value={comment.text}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCommentChange(index, e.target.value)}
                  placeholder="コメントを入力..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {comment.author} - {new Date(comment.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
            <Button onClick={handleAddComment} variant="outline" size="sm" className="mt-2">
              コメントを追加
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} className="bg-[#37AB9D] text-white hover:bg-[#4DC0B2]">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const PersistentHeader: React.FC<PersistentHeaderProps> = ({ activeTask, elapsedTime, onStopTimer, onStartTimer, tasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [label1, setLabel1] = useState('')
  const [label2, setLabel2] = useState('')
  const [taskContent, setTaskContent] = useState('')

  const isStartDisabled = !selectedTaskId && (!label1 || !label2 || !taskContent)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId)
    const selectedTask = tasks[taskId]
    if (selectedTask) {
      setTaskContent(selectedTask.content)
      setLabel1(selectedTask.labels[0] || '')
      setLabel2(selectedTask.labels[1] || '')
    }
  }

  return (
    <div className="flex items-center justify-between bg-[#37AB9D] text-white p-4 mb-4 rounded-lg">
      <div className="flex items-center space-x-2 flex-grow">
        <Select onValueChange={handleTaskSelect} defaultValue={selectedTaskId}> 
          <SelectTrigger className="w-[180px] bg-white text-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(tasks).map(([id, task]) => (
              <SelectItem key={id} value={id}>{task.content}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={label1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel1(e.target.value)}
          placeholder="ラベル1"
          className="w-24 text-black"
        />
        <Input
          value={label2}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel2(e.target.value)}
          placeholder="ラベル2"
          className="w-24 text-black"
        />
        <Input
          value={taskContent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskContent(e.target.value)}
          placeholder="タスク"
          className="flex-grow text-black"
        />
      </div>
      <div className="flex items-center space-x-8 ml-4">
        <span className="text-xl font-bold">{formatTime(elapsedTime)}</span>
        {activeTask ? (
          <Button onClick={onStopTimer} variant="secondary" size="sm" className="rounded-full bg-[#f14134] text-white hover:bg-[#d63a2f]">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => {
              if (selectedTaskId) {
                onStartTimer(selectedTaskId, tasks[selectedTaskId].content, tasks[selectedTaskId].labels)
              } else {
                onStartTimer(null, taskContent, [label1, label2])
              }
            }} 
            variant="secondary" 
            size="default"
            className="rounded-full bg-[#f14134] text-white hover:bg-[#d63a2f]"
            disabled={isStartDisabled}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard() {
  const [state, setState] = useState(initialData)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const updateTaskTime = useCallback(() => {
    if (activeTaskId) {
      setState((prevState) => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [activeTaskId]: {
            ...prevState.tasks[activeTaskId as keyof typeof prevState.tasks],
            timeSpent: prevState.tasks[activeTaskId as keyof typeof prevState.tasks].timeSpent + 1,
          },
        },
      }))
    }
  }, [activeTaskId])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (activeTaskId) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
        updateTaskTime()
      }, 1000) // Update every second
    }
    return () => clearInterval(interval)
  }, [activeTaskId, updateTaskTime])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(state.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      }
      setState(newState)
      return
    }

    const start = state.columns[source.droppableId as keyof typeof state.columns]
    const finish = state.columns[destination.droppableId as keyof typeof state.columns]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      }

      setState(newState)
      return
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }
    setState(newState)
  }

  const handleAddList = () => {
    const newColumnId = `column-${state.columnOrder.length + 1}`
    const newColumn = {
      id: newColumnId,
      title: '新しいリスト',
      taskIds: [],
    }
    setState({
      ...state,
      columns: {
        ...state.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...state.columnOrder, newColumnId],
    })
  }

  const handleEditListTitle = (columnId: string, newTitle: string) => { 
    setState({
      ...state,
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId as keyof typeof state.columns], 
          title: newTitle,
        },
      },
    })
  }

  const handleAddTask = (columnId: string) => { 
    const newTaskId = `task-${Object.keys(state.tasks).length + 1}`
    const newTask = {
      id: newTaskId,
      content: '新しいタスク',
      labels: [],
      assignee: '',
      timeSpent: 0,
      checklist: [],
      comments: [],
      weeklyTotal: 0,
      monthlyTotal: 0,
      weeklyBestRecord: 0,
      monthlyBestRecord: 0,
    }
    setState({
      ...state,
      tasks: {
        ...state.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId as keyof typeof state.columns], 
          taskIds: [newTaskId, ...state.columns[columnId as keyof typeof state.columns].taskIds],
        },
      },
    })
  }

  const handleEditTask = (taskId: string, updatedFields: any) => {
    setState((prevState) => {
      const task = prevState.tasks[taskId as keyof typeof prevState.tasks]
      if (!task) {
        console.error(`Task with id ${taskId} not found`)
        return prevState
      }
      return {
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [taskId]: {
            ...task,
            ...updatedFields,
          },
        },
      }
    })
  }

  const handleOpenTaskModal = (taskId: string) => {
    setSelectedTask(state.tasks[taskId as keyof typeof state.tasks])  
    setIsModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleUpdateTask = (updatedTask: any) => {
    setState({
      ...state,
      tasks: {
        ...state.tasks,
        [updatedTask.id]: updatedTask,
      },
    })
  }

  const handleStartTimer = (taskId: string | null, taskContent: string, labels: string[]) => {
    if (taskId) {
      setActiveTaskId(taskId)
    } else {
      const newTaskId = `task-${Object.keys(state.tasks).length + 1}`
      const newTask = {
        id: newTaskId,
        content: taskContent,
        labels: labels.filter(Boolean),
        assignee: '',
        timeSpent: 0,
        checklist: [],
        comments: [],
        weeklyTotal: 0,
        monthlyTotal: 0,
        weeklyBestRecord: 0,
        monthlyBestRecord: 0,
      }
      setState((prevState) => ({
        ...prevState,
        tasks: {
          ...prevState.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prevState.columns,
          'column-1': {
            ...prevState.columns['column-1'],
            taskIds: [newTaskId, ...prevState.columns['column-1'].taskIds],
          },
        },
      }))
      setActiveTaskId(newTaskId) 
    }
    setElapsedTime(0)
  }

  const handleStopTimer = () => {
    setActiveTaskId(null)
    setElapsedTime(0)
  }

  return (
    <div className="p-4 bg-white">
      <PersistentHeader
        activeTask={activeTaskId ? state.tasks[activeTaskId as keyof typeof state.tasks] : null}
        elapsedTime={elapsedTime}
        onStopTimer={handleStopTimer}
        onStartTimer={handleStartTimer}
        tasks={state.tasks}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex space-x-4"
            >
              {state.columnOrder.map((columnId: string, index: number) => {
                const column = state.columns[columnId as keyof typeof state.columns]  
                const tasks = column.taskIds.map((taskId: string) => state.tasks[taskId as keyof typeof state.tasks]).filter(Boolean)

                return (
                  <TaskList
                    key={column.id}
                    column={column}
                    tasks={tasks}
                    index={index}
                    onEditListTitle={handleEditListTitle}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onOpenTaskModal={handleOpenTaskModal}
                    onStartTimer={(taskId) => handleStartTimer(taskId, '', [])}
                    onStopTimer={handleStopTimer}
                    activeTaskId={activeTaskId}
                  />
                )
              })}
              {provided.placeholder}
              <div className="w-80">
                <Button 
                  onClick={handleAddList} 
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600" 
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" /> リストを追加
                </Button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {isModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseTaskModal}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  )
}