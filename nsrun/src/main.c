#include <stdio.h>
#include "container.h"
#include "namespace.h"

// Container Run Command: 
// # Basic usage
// nsrun --rootfs ./alpine-rootfs /bin/sh
// nsrun --rootfs ./nginx-rootfs /usr/sbin/nginx

// # With options
// nsrun --rootfs ./alpine-rootfs --memory 256M --cpu 0.5 --hostname web-container /bin/sh
// nsrun --rootfs ./app-rootfs --port 8080:80 --detach /start.sh

// stack allocation for child process
#define STACK_SIZE (1024 * 1024) // 1MB
char child_stack[STACK_SIZE];

// Data to pass between functions: container config (rootfs path, command, hostname)
struct ArgsData {
    char *rootfs;
    char *command;
    char *hostname;
};

char *parse_args(int argc, char *argv[])
{
    // Simple argument parsing
    if (argc < 2) {
        return NULL;
    }
    return argv[1];
}

char *parse_input(char *input)
{
    fgets(input, 256, stdin);
    return input;
}

int main(int argc, char *argv[])
{
    // Command Line Validation
    char *namespace_name = parse_args(argc, argv);
    if (!namespace_name) {
        fprintf(stderr, "Usage: %s <namespace_name>\n", argv[0]);
        return 1;
    }

    // Initialize the container
    Container *container = create_container();

    // Create a new namespace
    Namespace *ns = create_namespace("my_namespace");

    // Add the namespace to the container
    add_namespace(container, ns);

    // Retrieve the namespace from the container
    Namespace *retrieved_ns = get_namespace(container, "my_namespace");
    if (retrieved_ns) {
        printf("Namespace '%s' found!\n", retrieved_ns->name);
    } else {
        printf("Namespace not found.\n");
    }

    // Clean up
    destroy_container(container);
    return 0;
}