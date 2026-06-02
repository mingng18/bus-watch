## 2024-05-30 - Optimize Station Schedule Generation Loop
**Learning:** Precomputing outer-loop constants like new Date() and replacing Array.find with manual standard loops on heavily nested datasets can drastically improve CPU execution time. Specifically, inline string parsing via charCodeAt avoids allocation bottlenecks.
**Action:** Always watch for object/date creations and implicit array scanning via closures like .find() within tight nested iterators.
