import { AnimatePresence, motion, TargetAndTransition } from 'framer-motion';
import React from 'react';
import styles from './App.module.css';

interface AppProps {}

const TRANSITION = { type: 'spring', stiffness: 80, damping: 20 };

function Cell({
  x,
  y,
  color,
  children,
}: {
  x: number;
  y: number;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ x, y, backgroundColor: color, opacity: 1 }}
      initial={{ opacity: 0, x, y: 16, backgroundColor: color }}
      transition={TRANSITION}
      className={styles.cell}
    >
      {children}
    </motion.div>
  );
}

enum Stage {
  Text,
  Args,
  ArgReady,
  Apply,
  ApplyLabel,
}

function App({}: AppProps) {
  const [stage, setStage] = React.useState(Stage.Text);
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <motion.div className={styles.text}>array.splice(2)</motion.div>
        {stage >= Stage.ApplyLabel ? (
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{ x: 0, y: 76 }}
            className={styles.smallText}
          >
            original array
          </motion.div>
        ) : null}
        {stage >= Stage.ApplyLabel ? (
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            style={{ x: 192 + 2 * (32 + 12), y: 76 }}
            className={styles.smallText}
          >
            return value
          </motion.div>
        ) : null}
        <AnimatePresence>
          {stage === Stage.ArgReady
            ? new Array(5).fill(undefined).map((_, i) => (
                <motion.div
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  style={{
                    x: 11 + i * (32 + 12),
                    y: 70,
                    position: 'absolute',
                    color: '#e0e0e0',
                    top: 0,
                    left: 0,
                  }}
                  exit={{ opacity: 0 }}
                  key={i}
                >
                  {i}
                </motion.div>
              ))
            : null}
        </AnimatePresence>
        {stage >= Stage.Args
          ? new Array(5).fill(undefined).map((_, i) => (
              <Cell
                x={(stage >= Stage.Apply && i >= 2 ? 192 : 0) + i * (32 + 12)}
                y={stage >= Stage.ArgReady ? 96 : 32}
                color={stage >= Stage.Apply && i >= 2 ? '#CA96F3' : '#ffc163'}
                key={i}
              >
                {String.fromCharCode('A'.charCodeAt(0) + i)}
              </Cell>
            ))
          : null}
        <AnimatePresence>
          {stage >= Stage.ArgReady && stage < Stage.Apply ? (
            <motion.div
              animate={{
                x: 99,
                y: 70,
              }}
              initial={{ x: 129, y: 0 }}
              exit={{ opacity: 0, x: 192 }}
              transition={TRANSITION}
              className={styles.indexArgument}
            >
              2
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <button onClick={() => setStage((stage) => stage + 1)}>Stage</button>
      <button onClick={() => setStage(0)}>Reset</button>
    </div>
  );
}

export default App;
