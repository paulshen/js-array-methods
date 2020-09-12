import {
  AnimatePresence,
  motion,
  MotionProps,
  TargetAndTransition,
} from 'framer-motion';
import React from 'react';
import styles from './App.module.css';

interface AppProps {}

const TRANSITION = { type: 'spring', stiffness: 80, damping: 20 };

function Cell({
  x,
  y,
  color,
  initial,
  children,
}: {
  x: number;
  y: number;
  color: string;
  initial?: MotionProps['initial'];
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ x, y, backgroundColor: color, opacity: 1 }}
      // @ts-ignore
      initial={{ opacity: 0, x, y: 16, backgroundColor: color, ...initial }}
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
  ArgReady2,
  Apply,
  Apply2,
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

function App2({}: AppProps) {
  const [stage, setStage] = React.useState(Stage.Text);
  const argument2Ref = React.useRef<HTMLDivElement>(null);
  const argument3Ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <motion.div className={styles.text}>
          array.splice(<span className={styles.argument}>2</span>,{' '}
          <span className={styles.argument}>3</span>, H, I)
        </motion.div>
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
            style={{ x: 312 + 2 * (32 + 12), y: 76 }}
            className={styles.smallText}
          >
            return value
          </motion.div>
        ) : null}
        <AnimatePresence>
          {stage === Stage.ArgReady || stage === Stage.ArgReady2
            ? new Array(7).fill(undefined).map((_, i) =>
                i !== 2 ? (
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
                ) : null,
              )
            : null}
          {stage === Stage.ArgReady2 ? (
            <>
              <motion.div
                animate={{ x: 143, y: 40 }}
                initial={{ x: 158, y: 0 }}
                exit={{ x: 143 + 64, opacity: 0 }}
                transition={TRANSITION}
                className={styles.indexArgument}
                ref={argument3Ref}
                onAnimationComplete={() => {
                  const node = argument3Ref.current!;
                  const transform = node.style.transform;
                  node.style.transform = transform;
                  node.style.transform = transform.replace(
                    'translateZ(0px)',
                    '',
                  );
                  requestAnimationFrame(() => {
                    node.style.transform = transform;
                  });
                }}
              >
                3
              </motion.div>
              <motion.div
                animate={{
                  x: 2 * 32 + 2 * 12,
                  y: 60,
                  opacity: 1,
                  transition: { delay: 0.5 },
                }}
                initial={{
                  x: 2 * 32 + 2 * 12,
                  y: 60,
                  opacity: 0,
                }}
                exit={{
                  x: 2 * 32 + 2 * 12 + 64,
                  opacity: 0,
                  transition: { delay: 0 },
                }}
                style={{ width: 3 * 32 + 2 * 12 }}
                transition={TRANSITION}
                className={styles.length}
              ></motion.div>
            </>
          ) : null}
        </AnimatePresence>
        {stage >= Stage.Args ? (
          <>
            {new Array(2).fill(undefined).map((_, i) => (
              <Cell
                x={i * (32 + 12)}
                y={stage >= Stage.ArgReady ? 96 : 32}
                color="#ffc163"
                key={i}
              >
                {String.fromCharCode('A'.charCodeAt(0) + i)}
              </Cell>
            ))}
            {new Array(3).fill(undefined).map((_, i) => (
              <Cell
                x={(stage >= Stage.Apply ? 312 : 0) + (2 + i) * (32 + 12)}
                y={stage >= Stage.ArgReady ? 96 : 32}
                color={stage >= Stage.ArgReady2 ? '#f38fab' : '#ffc163'}
                key={2 + i}
              >
                {String.fromCharCode('A'.charCodeAt(0) + (2 + i))}
              </Cell>
            ))}
            {new Array(2).fill(undefined).map((_, i) => (
              <Cell
                x={((stage >= Stage.Apply2 ? 4 : 5) + i) * (32 + 12)}
                y={stage >= Stage.ArgReady ? 96 : 32}
                color="#ffc163"
                key={5 + i}
              >
                {String.fromCharCode('A'.charCodeAt(0) + (5 + i))}
              </Cell>
            ))}
          </>
        ) : null}
        {stage >= Stage.Apply2 ? (
          <>
            <Cell
              x={stage >= Stage.Apply2 ? 2 * (32 + 12) : 384}
              y={stage >= Stage.Apply2 ? 96 : 32}
              initial={{ x: 177, y: -7 }}
              color={stage >= Stage.ApplyLabel ? '#ffc163' : '#58CDE7'}
            >
              H
            </Cell>
            <Cell
              x={stage >= Stage.Apply2 ? 3 * (32 + 12) : 384 + 32 + 12}
              y={stage >= Stage.Apply2 ? 96 : 32}
              initial={{ x: 177 + 32 + 12, y: -7 }}
              color={stage >= Stage.ApplyLabel ? '#ffc163' : '#58CDE7'}
            >
              I
            </Cell>
          </>
        ) : null}
        <AnimatePresence>
          {stage >= Stage.ArgReady && stage < Stage.Apply ? (
            <motion.div
              animate={{
                x: 99,
                y: 70,
              }}
              initial={{ x: 129, y: 0 }}
              exit={{ opacity: 0, x: 99 + 64 }}
              transition={TRANSITION}
              ref={argument2Ref}
              className={styles.indexArgument}
              onAnimationComplete={() => {
                const node = argument2Ref.current!;
                const transform = node.style.transform;
                node.style.transform = transform.replace('translateZ(0px)', '');
                requestAnimationFrame(() => {
                  node.style.transform = transform;
                });
              }}
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

export default App2;
