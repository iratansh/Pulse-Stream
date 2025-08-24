Background
A container runtime is fundamentally about process isolation. When you run docker run alpine /bin/sh, you're not starting a virtual machine - you're starting a regular Linux process that's been tricked into thinking it's running in its own little world.
