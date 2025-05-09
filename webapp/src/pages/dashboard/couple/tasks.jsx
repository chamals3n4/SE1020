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
import { PlusCircle, Calendar, Check, Clock, Pencil, Trash2 } from "lucide-react";
import { taskService, coupleService } from "@/services/api";

function CoupleTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    assignedTo: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");

  // Get current user information from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : {};
  const coupleId = user.id;
  const weddingId = user.weddingId;

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Exit early if no wedding ID is available
        if (!weddingId) {
          console.warn("No wedding ID found in user data. Please set up your wedding first.");
          setTasks([]);
          setIsLoading(false);
          return;
        }
        
        console.log(`Fetching tasks for wedding ID: ${weddingId}`);
        
        // Get tasks for this wedding
        const response = await taskService.getTasksByWeddingId(weddingId);
        if (response.data && Array.isArray(response.data)) {
          // Process tasks to ensure consistent ID and relationship fields
          const processedTasks = response.data.map(task => ({
            ...task,
            // Ensure each task has a reference to the wedding and couple
            weddingId: weddingId,
            coupleId: coupleId
          }));
          
          setTasks(processedTasks);
          console.log(`Loaded ${processedTasks.length} tasks for wedding ID: ${weddingId}`);
        } else {
          console.log(`No tasks found for wedding ID: ${weddingId}`);
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
  }, [weddingId, coupleId]);

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
      // Validate form
      if (!newTask.title || !newTask.dueDate) {
        alert("Please provide a title and due date.");
        return;
      }

      // Ensure we have a wedding ID
      if (!weddingId) {
        alert("You need to set up your wedding details before adding tasks.");
        return;
      }
      
      // Generate consistent IDs with timestamp
      const timestamp = Date.now();
      const taskId = `task-${timestamp}`;
      
      // Convert the date string to a proper Date object
      const dueDateObj = new Date(newTask.dueDate);
      
      // Create a properly formatted task object that matches the backend model
      // with consistent ID fields and proper relationships
      const taskToAdd = {
        id: taskId, // Primary identifier
        taskId: taskId, // For backward compatibility
        title: newTask.title,
        description: newTask.description || "",
        dueDate: dueDateObj.toISOString(),
        createdAt: new Date().toISOString(),
        completed: false,
        isCompleted: false, // For backward compatibility
        priority: newTask.priority,
        assignedTo: newTask.assignedTo || "",
        // Relationship fields
        weddingId: weddingId,
        coupleId: coupleId,
        // Additional frontend-only properties that won't impact backend
        title: newTask.title,
        priority: newTask.priority,
        assignedTo: newTask.assignedTo
      };

      console.log("Sending task to backend:", taskToAdd);
      
      try {
        const response = await taskService.createTask(taskToAdd);
        console.log("Task creation response:", response);
        
        if (response.data) {
          // Add the new task to our list
          setTasks([...tasks, response.data]);
          setIsAddDialogOpen(false);
          
          // Reset form
          setNewTask({
            title: "",
            description: "",
            dueDate: "",
            priority: "MEDIUM",
            assignedTo: "",
          });
        } else {
          alert("Could not create task. Please try again later.");
        }
      } catch (error) {
        console.error("Detailed task creation error:", error.response || error);
        alert("Error creating task: " + (error.response?.data?.message || error.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred while adding the task. Please try again later.");
    }
  };

  const handleEditTask = async () => {
    try {
      // Validate form
      if (!editingTask.title || !editingTask.dueDate) {
        alert("Please provide a title and due date.");
        return;
      }

      const response = await taskService.updateTask(editingTask.id, editingTask);
      
      if (response && response.data) {
        // Update state after successful API call
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? response.data : task
        ));
        
        setIsEditDialogOpen(false);
        setEditingTask(null);
      } else {
        alert("Failed to update task. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("An error occurred while updating the task. Please try again later.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (!confirm("Are you sure you want to delete this task?")) return;
      
      const response = await taskService.deleteTask(taskId);
      
      if (response) {
        // Update state after successful API call
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        alert("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An error occurred while deleting the task. Please try again later.");
    }
  };

  const handleToggleTaskCompletion = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed
      };
      
      const response = await taskService.updateTask(taskId, updatedTask);
      
      if (response && response.data) {
        // Update state after successful API call
        setTasks(tasks.map(task => 
          task.id === taskId ? response.data : task
        ));
      } else {
        alert("Failed to update task completion status. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      alert("An error occurred while updating the task. Please try again.");
    }
  };

  const openEditTaskDialog = (task) => {
    setEditingTask({...task});
    setIsEditDialogOpen(true);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "COMPLETED":
        return tasks.filter(task => task.completed);
      case "INCOMPLETE":
        return tasks.filter(task => !task.completed);
      case "HIGH":
        return tasks.filter(task => task.priority === "HIGH");
      case "MEDIUM":
        return tasks.filter(task => task.priority === "MEDIUM");
      case "LOW":
        return tasks.filter(task => task.priority === "LOW");
      default:
        return tasks;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">High</Badge>;
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Medium</Badge>;
      case "LOW":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredTasks = getFilteredTasks();

  if (isLoading) {
    return <div className="py-10 text-center">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Wedding Tasks</h1>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Tasks</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
              <SelectItem value="HIGH">High Priority</SelectItem>
              <SelectItem value="MEDIUM">Medium Priority</SelectItem>
              <SelectItem value="LOW">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task for your wedding planning
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Book Venue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Describe this task..."
                    rows={3}
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
                    value={newTask.priority} 
                    onValueChange={(value) => setNewTask({...newTask, priority: value})}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    name="assignedTo"
                    value={newTask.assignedTo}
                    onChange={handleInputChange}
                    placeholder="e.g., Sarah, Michael, Both"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task details
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editingTask.title}
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
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  name="dueDate"
                  type="date"
                  value={editingTask.dueDate}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={editingTask.priority} 
                  onValueChange={(value) => setEditingTask({...editingTask, priority: value})}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-assignedTo">Assigned To</Label>
                <Input
                  id="edit-assignedTo"
                  name="assignedTo"
                  value={editingTask.assignedTo}
                  onChange={handleEditInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-completed" 
                  checked={editingTask.completed}
                  onCheckedChange={(checked) => 
                    setEditingTask({...editingTask, completed: checked})
                  }
                />
                <label 
                  htmlFor="edit-completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as completed
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTask}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-muted-foreground mt-2">
            {filter !== "ALL" 
              ? "Try adjusting your filter to see more tasks" 
              : "Start by adding your first wedding planning task"}
          </p>
          {filter !== "ALL" && (
            <Button variant="outline" onClick={() => setFilter("ALL")} className="mt-4">
              Show All Tasks
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`border ${task.completed ? 'bg-slate-50 border-slate-100' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                    />
                    <CardTitle className={`text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getPriorityBadge(task.priority)}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditTaskDialog(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {task.assignedTo && (
                  <CardDescription>
                    Assigned to: {task.assignedTo}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${task.completed ? 'text-muted-foreground' : ''}`}>
                  {task.description || "No description provided"}
                </p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoupleTasks;
