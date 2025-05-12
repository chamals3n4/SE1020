import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Calendar,
  Check,
  Clock,
  Pencil,
  Trash2,
  Filter,
  SortAsc,
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { taskService, coupleService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { format, isAfter, isBefore, isToday } from "date-fns";

function CoupleTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    isCompleted: false,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DUE_DATE");

  // Get current user information from localStorage
  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : {};
  const weddingId = user.weddingId;

  const navigate = useNavigate();

  // Redirect to wedding setup if no wedding ID
  useEffect(() => {
    if (!weddingId) {
      toast({
        title: "Wedding Setup Required",
        description: "Please set up your wedding details first",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/couple/wedding")}
          >
            Setup Now
          </Button>
        ),
      });
    }
  }, [weddingId, navigate]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!weddingId) {
          setTasks([]);
          setIsLoading(false);
          return;
        }

        const response = await taskService.getTasksByWeddingId(weddingId);
        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [weddingId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async () => {
    try {
      if (!newTask.name || !newTask.description || !newTask.dueDate) {
        toast.error("Please provide a name, description, and due date.");
        return;
      }

      if (!weddingId) {
        toast.error(
          "You need to set up your wedding details before adding tasks."
        );
        return;
      }

      const taskToAdd = {
        taskId: `task-${Date.now()}`,
        weddingId: weddingId,
        name: newTask.name,
        description: newTask.description,
        dueDate: new Date(newTask.dueDate),
        priority: newTask.priority,
        isCompleted: false,
      };

      const response = await taskService.createTask(taskToAdd);

      if (response.data) {
        setTasks([...tasks, response.data]);
        setIsAddDialogOpen(false);
        toast.success("Task added successfully");
        setNewTask({
          name: "",
          description: "",
          dueDate: "",
          priority: "MEDIUM",
          isCompleted: false,
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  const handleEditTask = async () => {
    try {
      if (!editingTask.description || !editingTask.dueDate) {
        toast.error("Please provide a description and due date.");
        return;
      }

      const response = await taskService.updateTask(editingTask.taskId, {
        ...editingTask,
        dueDate: new Date(editingTask.dueDate),
      });

      if (response && response.data) {
        setTasks(
          tasks.map((task) =>
            task.taskId === editingTask.taskId ? response.data : task
          )
        );
        setIsEditDialogOpen(false);
        setEditingTask(null);
        toast.success("Task updated successfully");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (!confirm("Are you sure you want to delete this task?")) return;

      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.taskId !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleToggleTaskCompletion = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((task) => task.taskId === taskId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        isCompleted: !taskToUpdate.isCompleted,
      };

      const response = await taskService.updateTask(taskId, updatedTask);

      if (response && response.data) {
        setTasks(
          tasks.map((task) => (task.taskId === taskId ? response.data : task))
        );
        toast.success("Task status updated");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task status");
    }
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    // Apply filter
    switch (filter) {
      case "COMPLETED":
        filteredTasks = tasks.filter((task) => task.isCompleted);
        break;
      case "INCOMPLETE":
        filteredTasks = tasks.filter((task) => !task.isCompleted);
        break;
      case "OVERDUE":
        filteredTasks = tasks.filter(
          (task) =>
            !task.isCompleted && isBefore(new Date(task.dueDate), new Date())
        );
        break;
      case "TODAY":
        filteredTasks = tasks.filter((task) => isToday(new Date(task.dueDate)));
        break;
      default:
        filteredTasks = tasks;
    }

    // Apply sorting
    return filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case "PRIORITY":
          return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        case "DUE_DATE":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "NAME":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const getPriorityWeight = (priority) => {
    switch (priority) {
      case "URGENT":
        return 4;
      case "HIGH":
        return 3;
      case "MEDIUM":
        return 2;
      case "LOW":
        return 1;
      default:
        return 0;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "URGENT":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            Urgent
          </Badge>
        );
      case "HIGH":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">
            High
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            Medium
          </Badge>
        );
      case "LOW":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            Low
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">
            {priority}
          </Badge>
        );
    }
  };

  const getDueDateStatus = (dueDate) => {
    const date = new Date(dueDate);
    if (isBefore(date, new Date()) && !isToday(date)) {
      return "OVERDUE";
    } else if (isToday(date)) {
      return "TODAY";
    } else if (isAfter(date, new Date())) {
      return "UPCOMING";
    }
    return "UNKNOWN";
  };

  const getDueDateBadge = (dueDate) => {
    const status = getDueDateStatus(dueDate);
    switch (status) {
      case "OVERDUE":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            Overdue
          </Badge>
        );
      case "TODAY":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            Today
          </Badge>
        );
      case "UPCOMING":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            Upcoming
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wedding Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your wedding planning tasks and stay organized
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task for your wedding planning
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Task Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newTask.name}
                  onChange={handleInputChange}
                  placeholder="Enter task name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  name="priority"
                  value={newTask.priority}
                  onValueChange={(value) =>
                    setNewTask((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Sort Section */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Tasks</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="TODAY">Due Today</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DUE_DATE">Due Date</SelectItem>
              <SelectItem value="PRIORITY">Priority</SelectItem>
              <SelectItem value="NAME">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Bar List */}
      <div className="w-full max-w-3xl mx-auto divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
        {getFilteredAndSortedTasks().map((task) => (
          <div
            key={task.taskId}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 transition-all duration-150 hover:bg-violet-50 group ${
              task.isCompleted ? "opacity-70" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Checkbox
                id={`task-${task.taskId}`}
                checked={task.isCompleted}
                onCheckedChange={() => handleToggleTaskCompletion(task.taskId)}
                className="h-5 w-5 flex-shrink-0"
              />
              <span
                className={`font-semibold text-base truncate ${
                  task.isCompleted
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
                title={task.name}
              >
                {task.name}
              </span>
              {getPriorityBadge(task.priority)}
              {getDueDateBadge(task.dueDate)}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <span
                className="text-sm text-gray-600 truncate"
                title={task.description}
              >
                {task.description || (
                  <span className="italic text-gray-400">No description</span>
                )}
              </span>
              <span className="flex items-center text-xs text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  setEditingTask({ ...task });
                  setIsEditDialogOpen(true);
                }}
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleDeleteTask(task.taskId)}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {getFilteredAndSortedTasks().length === 0 && (
          <div className="text-center py-12 w-full">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "ALL"
                ? "Get started by adding your first task"
                : "No tasks match the current filter"}
            </p>
            {filter !== "ALL" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilter("ALL")}
              >
                Clear Filter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Task Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingTask.name}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={editingTask.description}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  name="dueDate"
                  type="date"
                  value={format(new Date(editingTask.dueDate), "yyyy-MM-dd")}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  name="priority"
                  value={editingTask.priority}
                  onValueChange={(value) =>
                    setEditingTask((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CoupleTasks;
