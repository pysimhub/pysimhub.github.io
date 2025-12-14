---
layout: blog
title: Blog Formatting Guide
date: '2025-12-13'
author: PySimHub Team
description: A comprehensive guide to all formatting options available in PySimHub blog posts, including math, figures, code, and more.
tags:
  - guide
  - documentation
readingTime: 5 min read
---

<script>
  import Math from '$lib/components/Math.svelte';

  // Define formulas as constants to avoid escaping issues
  const emc2 = "E = mc^2";
  const reynolds = "Re = \\frac{\\rho u L}{\\mu}";
  const gaussian = "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}";
  const ode_solution = "y(t) = c_1 e^{r_1 t} + c_2 e^{r_2 t}";
  const summation = "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}";
  const matrix = "\\mathbf{A} = \\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix}";
  const navier_stokes = "\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}";
  const ode = "\\frac{dy}{dt} = f(t, y)";
  const euler = "y_{n+1} = y_n + h \\cdot f(t_n, y_n)";
  const bigO = "O(h)";
</script>

This post demonstrates all the formatting options available for PySimHub blog posts.

## Text Formatting

You can write **bold text**, *italic text*, and ***bold italic*** text. You can also use `inline code` for technical terms or short code snippets.

> Blockquotes are great for highlighting important information or quoting sources. They stand out with an accent-colored left border.

Here's a [link to the PySimHub homepage](/) and an [external link to GitHub](https://github.com/pysimhub).

---

## Headings

The heading above is an H2. Below are examples of other heading levels:

### This is an H3 Heading

#### This is an H4 Heading

---

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists

1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B

---

## Code Blocks

Inline code looks like `this`. For longer code, use fenced code blocks:

```python
import numpy as np
from scipy.integrate import odeint

def lorenz(state, t, sigma=10, rho=28, beta=8/3):
    """The Lorenz system of differential equations."""
    x, y, z = state
    return [
        sigma * (y - x),
        x * (rho - z) - y,
        x * y - beta * z
    ]

# Initial conditions and time span
initial_state = [1.0, 1.0, 1.0]
t = np.linspace(0, 50, 10000)

# Solve the system
solution = odeint(lorenz, initial_state, t)
```

```javascript
// JavaScript example
const simulate = async (model, params) => {
  const results = await model.run(params);
  return results.map(r => r.value);
};
```

---

## Mathematics

PySimHub blog posts support LaTeX math rendering via KaTeX.

### Inline Math

The famous equation <Math f={emc2} /> shows the equivalence of mass and energy. The Reynolds number <Math f={reynolds} /> characterizes flow regimes.

### Display Math

The Gaussian integral:

<Math d f={gaussian} />

A simple differential equation solution:

<Math d f={ode_solution} />

Summation example:

<Math d f={summation} />

Matrix notation:

<Math d f={matrix} />

The Navier-Stokes equations:

<Math d f={navier_stokes} />

---

## Tables

| Method | Accuracy | Speed | Use Case |
|--------|----------|-------|----------|
| Euler | Low | Fast | Quick estimates |
| RK4 | High | Medium | General purpose |
| Adams-Bashforth | High | Fast | Long simulations |
| Implicit | Very High | Slow | Stiff systems |

---

## Images

Standard markdown images:

![PySimHub Logo](/branding/logo.svg)

For more control, use HTML figure elements:

<figure>
  <img src="/branding/logo.svg" alt="PySimHub Logo" style="max-width: 200px; margin: 0 auto; display: block;">
  <figcaption>Figure 1: The PySimHub logo represents interconnected simulation domains.</figcaption>
</figure>

---

## Combining Elements

Here's an example combining text, math, and code to explain a concept:

The **Euler method** is the simplest numerical integration technique. Given an ODE <Math f={ode} />, we approximate the solution at discrete time steps:

<Math d f={euler} />

where *h* is the step size. Implementation in Python:

```python
def euler_step(f, t, y, h):
    """Perform one Euler integration step."""
    return y + h * f(t, y)
```

> **Note:** While simple, the Euler method has <Math f={bigO} /> local error, making it less accurate than higher-order methods like RK4.

---

## Summary

This guide covered:

1. **Text formatting** - bold, italic, links, blockquotes
2. **Structure** - headings, lists, horizontal rules
3. **Code** - inline and fenced code blocks
4. **Math** - inline and display LaTeX equations via the Math component
5. **Media** - images and figures with captions
6. **Data** - tables for structured information

Happy writing!
