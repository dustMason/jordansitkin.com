from PIL import Image
from random import randint
from math import sqrt
import sys
import json
import numpy as np
import math

#
# usage:
# > python create_point_cloud dave.jpg 30000
#
# outputs a sorted list of coordinates as x,y pairs to STDOUT in JSON
#

def find_targets(n, image):
    """Given an image, return a list of x,y coordinates representing a random
    cloud of the darkest pixels. Non-deterministic."""
    pixels = list(image.getdata())
    W, H = image.size
    targets = []
    for i in range(0,int(n)):
        pos = target(pixels, randint(0,W-1), randint(0, H-1), width, height, 0)
        targets.append(pos)
    return targets
    
def target(pixels, x, y, W, H, depth):
    """Returns a single target pixel from array of image pixels."""
    index = y * W + x
    pixel = pixels[index]
    if depth == 15 or is_valid_target(pixel):
        pos = np.array((x,y))
    else:
        pos = target(pixels, randint(0,W-1), randint(0,H-1), W, H, depth+1)
    return pos

def is_valid_target(pixel):
    """Use a perceptual brightness formula to determine if pixel is dark enough
    to include. Will randomly return False, with greater probability for
    brighter pixels."""
    R, G, B = pixel
    brightness = sqrt((0.241*R**2) + (0.691*G**2) + (0.068*B**2))
    if brightness > 220:
        return False
    else:
        value = int(translate(brightness, 0, 255, 1, 200))
        r = randint(0, value)
        return r <= 1
        
def translate(value, leftMin, leftMax, rightMin, rightMax):
    """Equivalent to processing.org's map function"""
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin
    valueScaled = float(value - leftMin) / float(leftSpan)
    return rightMin + (valueScaled * rightSpan)

def sort_points(targets):
    """Given a list of vectors (as numpy arrays) representing a point cloud,
    return them in semi-random order, weighted to form clusters of nearby
    points."""
    points = []
    i = 0
    start_index = randint(0, len(targets))
    points.append(targets.pop(start_index))
    while len(targets) > 0:
        last_point = points[i]
        next_index = get_closest_index(last_point, targets)
        points.append(targets.pop(next_index))
        i += 1
    return points

def get_closest_index(point, targets):
    """Returns the index of the closest point to `point` in `targets` by
    euclidean distance."""
    closest_dist = math.inf
    closest_index = 0
    dis = 0
    for i, target in enumerate(targets):
        dis = np.linalg.norm(point - target) # euclidean distance
        if dis < closest_dist:
            closest_dist = dis
            closest_index = i
    return i
    
# TODO port this alternate algorithm that includes a "stretchiness" factor

# int getClosestIndex(PVector start, int n, ArrayList <PVector> lookup) {
#   float[] closestDist = new float[n];
#   int[] closestIndex = new int[n];
# 
#   for (int i = 0; i < n; i++) {
#     closestDist[i] = width*height;
#     closestIndex[i] = 0;
#   }
# 
#   float dis = 0;
#   float disMin = width*height, disMax = disMin*2;
# 
#   for (int i = 0; i < lookup.size(); i++) {
#     dis = PVector.dist(start, lookup.get(i));
#     if (dis < disMin ) {
#       disMin = dis;
#       closestDist[0] = dis;
#       closestIndex[0] = i;
#     } else if (dis > disMin && dis < disMax) {
#       int index = i;
#       for (int j = 0; j < n-1; j++) {
#         if (closestDist[j] < dis && closestDist[j+1] > dis) {
#           index=j+1;
#           break;
#         }
#       }
#       for (int j = n-1; j > 0; j--) {
#         if (j == index) {
#           closestDist[j] = dis;
#           closestIndex[j] = i;
#           break;
#         } else {
#           if (j > 1) {
#             closestIndex[j] = closestIndex[j-1];
#             closestDist[j] = closestDist[j-1];
#           }
#         }
#       }
#       disMax = closestDist[n-1];
#     }
#   }
# 
#   /* int index = closestIndex[(int) random(n)]; */
#   int index = closestIndex[(int) n-1];
#   return index;
# }

point_cloud = find_targets(sys.argv[2], Image.open(sys.argv[1]))
print(json.dumps(list(map(lambda p: p.tolist(), sort_points(point_cloud)))))
