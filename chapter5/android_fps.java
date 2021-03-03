private void calculateLag(long frameTimeNanos){
/*final long frameTimeNanos = mChoreographer.getFrameTimeNanos();*/
mLastFrameTimeNanos = System.nanoTime();
    if (mLastFrameTimeNanos != 0) {
        long costTime= (frameTimeNanos - mLastFrameTimeNanos)/ 1000000.0F;//计算成毫秒
        //严重卡顿，单帧超过250ms
        if (costTime>= bigJankTime) {
            bJank = true;
        } else if (costTime>= criticalBlockTime) {//超过50ms
                mCriticalBlockCount++;
        } else {
            if (bJank) {
                //严重卡顿上报逻辑
            } else if (mCriticalBlockCount >= cStuckThreshold) {
                //卡顿上报逻辑，5次50ms
            }
        }
    }
    mLastFrameTimeNanos = frameTimeNanos;
}
