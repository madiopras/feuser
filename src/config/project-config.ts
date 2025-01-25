import { type Project } from "@/app/api/projects/data";
import { type Board } from "@/app/api/boards/data";

export const createProject = async (project: Project) => {
  try {
    const response = await fetch("/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  try {
    const response = await fetch(`/api/projects/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Failed to update project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    const response = await fetch(`/api/projects/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const createBoard = async (board: Board) => {
  try {
    const response = await fetch("/api/boards/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });

    if (!response.ok) {
      throw new Error("Failed to create board");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

export const updateBoard = async (id: string, board: Partial<Board>) => {
  try {
    const response = await fetch(`/api/boards/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(board),
    });

    if (!response.ok) {
      throw new Error("Failed to update board");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating board:", error);
    throw error;
  }
};

export const deleteBoard = async (id: string) => {
  try {
    const response = await fetch(`/api/boards/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete board");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting board:", error);
    throw error;
  }
};

export const swapBoard = async (sourceId: string, destinationId: string) => {
  try {
    const response = await fetch("/api/boards/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sourceId, destinationId }),
    });

    if (!response.ok) {
      throw new Error("Failed to swap boards");
    }

    return await response.json();
  } catch (error) {
    console.error("Error swapping boards:", error);
    throw error;
  }
};

export const postComment = async (boardId: string, comment: any) => {
  try {
    const response = await fetch(`/api/boards/${boardId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error("Failed to post comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};

export const getProject = async (id: string) => {
  try {
    const response = await fetch(`/api/projects/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const createTask = async (boardId: string, task: any) => {
  try {
    const response = await fetch(`/api/boards/${boardId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId: string, task: any) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const getSubtasks = async (taskId: string) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/subtasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch subtasks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    throw error;
  }
};

export const createSubTask = async (taskId: string, subtask: any) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subtask),
    });

    if (!response.ok) {
      throw new Error("Failed to create subtask");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating subtask:", error);
    throw error;
  }
};

export const updateSubTask = async (taskId: string, subtaskId: string, subtask: any) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subtask),
    });

    if (!response.ok) {
      throw new Error("Failed to update subtask");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating subtask:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const deleteSubTask = async (taskId: string, subtaskId: string) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete subtask");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
}; 