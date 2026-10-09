/**
 * Pied Piper "Middle-Out" Action Compressor
 * 
 * Collapses long-running execution graphs into minimal-latency execution waves
 * via Boolean Precondition Short-Circuiting, Directed Acyclic Graph (DAG) Parallelization,
 * and Latency Watchdog Handoff to Diagrid Durable Execution.
 */

export interface ActionNode {
  id: string;
  name: string;
  dependencies: string[];
  estimatedDurationMs: number;
  booleanPrecondition?: (context: Record<string, unknown>) => boolean;
  execute: (context: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export interface CompressionPlan {
  originalStepsCount: number;
  retainedStepsCount: number;
  skippedSteps: string[];
  compressedWaves: string[][];
  estimatedSequentialDurationMs: number;
  estimatedCompressedDurationMs: number;
  compressionRatio: number;
}

export interface ExecutionResult {
  completedSteps: string[];
  skippedSteps: string[];
  totalDurationMs: number;
  context: Record<string, unknown>;
  handedOffToDurable: boolean;
}

export class ActionCompressor {
  private timeoutThresholdMs: number;

  constructor(timeoutThresholdMs = 8000) {
    this.timeoutThresholdMs = timeoutThresholdMs;
  }

  public analyzeAndCompress(
    nodes: ActionNode[],
    context: Record<string, unknown>
  ): CompressionPlan {
    const skippedSteps: string[] = [];
    const activeNodes: ActionNode[] = [];

    for (const node of nodes) {
      if (node.booleanPrecondition && !node.booleanPrecondition(context)) {
        skippedSteps.push(node.id);
      } else {
        activeNodes.push(node);
      }
    }

    const compressedWaves: string[][] = [];
    const completed = new Set<string>(skippedSteps);
    const remaining = new Map<string, ActionNode>(activeNodes.map((n) => [n.id, n]));

    while (remaining.size > 0) {
      const currentWave: ActionNode[] = [];
      for (const [id, node] of remaining.entries()) {
        const canRun = node.dependencies.every((dep) => completed.has(dep));
        if (canRun) {
          currentWave.push(node);
        }
      }

      if (currentWave.length === 0) {
        currentWave.push(...Array.from(remaining.values()));
        for (const n of currentWave) {
          remaining.delete(n.id);
          completed.add(n.id);
        }
        compressedWaves.push(currentWave.map((n) => n.id));
        break;
      }

      for (const n of currentWave) {
        remaining.delete(n.id);
        completed.add(n.id);
      }
      compressedWaves.push(currentWave.map((n) => n.id));
    }

    const originalSequential = nodes.reduce((sum, n) => sum + n.estimatedDurationMs, 0);
    const nodeMap = new Map<string, ActionNode>(nodes.map((n) => [n.id, n]));
    const compressedDuration = compressedWaves.reduce((sum, wave) => {
      const waveMax = Math.max(
        ...wave.map((id) => nodeMap.get(id)?.estimatedDurationMs || 0)
      );
      return sum + waveMax;
    }, 0);

    const ratio = originalSequential / Math.max(compressedDuration, 1);

    return {
      originalStepsCount: nodes.length,
      retainedStepsCount: activeNodes.length,
      skippedSteps,
      compressedWaves,
      estimatedSequentialDurationMs: originalSequential,
      estimatedCompressedDurationMs: compressedDuration,
      compressionRatio: Number(ratio.toFixed(2)),
    };
  }

  public async executeCompressedWorkflow(
    nodes: ActionNode[],
    initialContext: Record<string, unknown> = {},
    onWatchdogTrip?: (remainingContext: Record<string, unknown>) => Promise<void>
  ): Promise<ExecutionResult> {
    const plan = this.analyzeAndCompress(nodes, initialContext);
    const nodeMap = new Map<string, ActionNode>(nodes.map((n) => [n.id, n]));
    const currentContext = { ...initialContext };
    const completedSteps: string[] = [];
    const startTime = Date.now();
    let handedOffToDurable = false;

    for (const wave of plan.compressedWaves) {
      const elapsed = Date.now() - startTime;
      if (elapsed >= this.timeoutThresholdMs && onWatchdogTrip) {
        handedOffToDurable = true;
        await onWatchdogTrip(currentContext);
        break;
      }

      const wavePromises = wave.map(async (nodeId) => {
        const node = nodeMap.get(nodeId);
        if (!node) return {};
        return node.execute(currentContext);
      });

      const waveResults = await Promise.all(wavePromises);
      for (const res of waveResults) {
        Object.assign(currentContext, res);
      }
      completedSteps.push(...wave);
    }

    return {
      completedSteps,
      skippedSteps: plan.skippedSteps,
      totalDurationMs: Date.now() - startTime,
      context: currentContext,
      handedOffToDurable,
    };
  }
}

export const actionCompressor = new ActionCompressor();
