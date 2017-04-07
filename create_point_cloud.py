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
        pos = target(pixels, randint(0,W-1), randint(0, H-1), W, H, 0)
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
        return r <= 20
        
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
        # next_index = nearest_neighbor_index(last_point, targets)
        next_index = chaotic_nearest_neighbor_index(last_point, targets, 20)
        points.append(targets.pop(next_index))
        i += 1
    return points

def nearest_neighbor_index(point, targets):
    """Returns the index of the closest point to `point` in `targets` by
    euclidean distance. AKA Naïve Nearest Neighbor."""
    closest_dist = math.inf
    closest_index = 0
    dis = 0
    for i, target in enumerate(targets):
        dis = np.linalg.norm(target - point) # euclidean distance
        if dis < closest_dist:
            closest_dist = dis
            closest_index = i
    return closest_index
    
def chaotic_nearest_neighbor_index(point, targets, samples):
    """Like `nearest_neighbor_index`, but returns a random point from among
    the n nearest neighbors, where n = `samples`. Slow."""
    closest_dist = [math.inf] * samples
    closest_index = [0] * samples
    dis = 0.0
    dis_min = math.inf
    dis_max = math.inf
    
    for i, target in enumerate(targets):
        dis = np.linalg.norm(target - point) # euclidean distance
        if dis < dis_min:
            dis_min = dis
            closest_dist[0] = dis
            closest_index[0] = i
        elif dis > dis_min and dis < dis_max:
            index = 1
            for j in range(0,samples-1):
                if dis > closest_dist[j] and dis < closest_dist[j+1]:
                    index = j+1
                    break
            for j in range(samples-1, 0, -1):
                if j == index:
                    closest_dist[j] = dis
                    closest_index[j] = i
                    break
                elif j > 1:
                    closest_index[j] = closest_index[j-1]
                    closest_dist[j] = closest_dist[j-1]
            dis_max = closest_dist[samples-1]
            
    return closest_index[randint(0,samples-1)]

point_cloud = find_targets(sys.argv[2], Image.open(sys.argv[1]))
print(json.dumps(list(map(lambda p: p.tolist(), sort_points(point_cloud)))))
