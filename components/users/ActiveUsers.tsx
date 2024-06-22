"use client";

import { useMemo } from "react";

import { generateRandomName } from "@/lib/utils";
import { useOthers, useSelf } from "@/liveblocks.config";
import { AnimatePresence, motion } from "framer-motion";

import Avatar from "./Avatar";

const animationProps = {
  initial: { width: 0, transformOrigin: "left" },
  animate: { width: "auto", height: "auto" },
  exit: { width: 0 },
  transition: {
    type: "spring",
    damping: 15,
    mass: 1,
    stiffness: 200,
    restSpeed: 0.01,
  },
};

const avatarProps = {
  style: { marginLeft: "-0.45rem" },
  size: 48,
  outlineWidth: 3,
  outlineColor: "white",
};

const ActiveUsers = () => {
  /**
   * useOthers returns the list of other users in the room.
   *
   * useOthers: https://liveblocks.io/docs/api-reference/liveblocks-react#useOthers
   */
  const others = useOthers();

  /**
   * useSelf returns the current user details in the room
   *
   * useSelf: https://liveblocks.io/docs/api-reference/liveblocks-react#useSelf
   */
  const currentUser = useSelf();

  // memoize the result of this function so that it doesn't change on every render but only when there are new users joining the room
  const memoizedUsers = useMemo(() => {
    const hasMoreUsers = others.length > 2;

    return (
      <div
        style={{
          minHeight: avatarProps.size + "px",
          display: "flex",
          paddingLeft: "0.75rem",
          overflow: "hidden",
        }}
      >
        <AnimatePresence>
          {currentUser && (
            <motion.div key='you' {...animationProps}>
              <Avatar
                {...avatarProps}
                name='You'
                otherStyles='border-[3px] border-primary-green'
              />
            </motion.div>
          )}

          {others.slice(0, 2).reverse().map(({ connectionId }) => (
            <motion.div key={connectionId} {...animationProps}>
              <Avatar
                {...avatarProps}
                key={connectionId}
                name={generateRandomName()}
                otherStyles='-ml-3'
              />
            </motion.div>
          ))}

          {hasMoreUsers && (
            <motion.div key="count" {...animationProps}>
              +{others.length - 2}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }, [others.length]);

  return memoizedUsers;
};

export default ActiveUsers;
