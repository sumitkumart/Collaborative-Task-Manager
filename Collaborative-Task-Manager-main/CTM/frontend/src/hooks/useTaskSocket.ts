import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import type { Task } from "../types";

export const useTaskSocket = (onAssigned?: (task: Task) => void) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    const socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const refresh = () =>
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

    socket.on("task:created", refresh);
    socket.on("task:updated", refresh);
    socket.on("task:deleted", refresh);
    socket.on("task:assigned", (task: Task) => {
      refresh();
      onAssigned?.(task);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, queryClient, onAssigned]);
};
