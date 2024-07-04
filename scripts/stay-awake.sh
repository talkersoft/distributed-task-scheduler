#!/bin/bash

# Function to display usage message
function usage() {
  echo "Usage: $0 <number_of_hours>"
  echo "  This script keeps your Mac awake for the specified number of hours."
  echo "  Press Ctrl+C to interrupt and allow sleep."
}

# Check if required argument (number of hours) is provided
if [ $# -eq 0 ]; then
  usage
  exit 1
fi

# Validate if the argument is a positive number
if [[ ! "$1" =~ ^[0-9]+$ ]]; then
  echo "Error: Please provide a positive number of hours as an argument."
  usage
  exit 1
fi

# Convert hours to seconds
hours="$1"
seconds=$(( hours * 60 * 60 ))

# Display message to user
echo "Your Mac will stay awake for $hours hours."
echo "Press Ctrl+C to interrupt and allow sleep."

# Run caffeinate with options
caffeinate -t "$seconds" -d -i

# Script exits after caffeinate finishes
exit 0
