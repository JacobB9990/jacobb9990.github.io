# Breaking Transmission Control Protocol

## Introduction

### What is Transmission Control Protocol

Transmission Control Protocol (TCP) is a transport-layer protocol from the 1970s, a part of the TCP/IP model. It ensures reliable data transfer through a three-way handshake between client and host. TCP includes rigorous safety checks, such as error detection, sequencing, flow control, and congestion control, making it challenging to break.

### How could we "Break" TCP

While TCP is extremely rigorous, it is not perfect because that is impossible. There are several ways to potentially disrupt TCP. One way is we can use programs to simulate poor network conditions, such as the `tc` (Traffic Control) tool in Linux. We can also block Wi-Fi signals by finding a location with weak connectivity or by placing obstacles between the router and devices. Additionally, I can overload the network with heavy data traffic, such as streaming videos and connecting multiple devices, to create bottlenecks. In the real world, these conditions are all possible, and common, but often occur at random. In this experiment I am just going to press "Ctrl + C" for convenience's sake.

## Method

I have created a straightforward program that transfers a file from my computer, which is connected to a switch via Ethernet, to my laptop over Wi-Fi. The image is just a picture of a mountain. I then will press "Ctrl + C" on the client side, which will terminate the program. From there, I will observe and record the results by using Wireshark, an amazing tool to capture network packets.

### Analyzing TCP Handshake and Congestion Flags with Wireshark

I used Wireshark to track and analyze the network traffic during a file transfer. I started by setting up a server and then launched the client to begin the transfer. I stopped the program shortly after the transfer began to examine what Wireshark had recorded. The results showed a smooth TCP three-way handshake with SYN, SYN&ACK, and ACK packets exchanged in order. This handshake is crucial for setting up a reliable connection between the client and server. During the session, I also noted the presence of additional TCP flags: ECE, CWR, and ECN.

- **ECE (Explicit Congestion Notification Echo)**: which is used to signal the presence of congestion to the sender.
- **CWR (Congestion Window Reduced)**: sent by the sender to acknowledge receipt of the ECE signal and confirm that it has adjusted its congestion window accordingly.
- **ECN (Explicit Congestion Notification)**: aimed at minimizing packet loss due to network congestion. It provides an early warning to endpoints about impending congestion, allowing them to reduce their sending rate and avoid packet drops.

![Wireshark SYN ACK](/assets/images/WiresharkSYNACK.png)

Seeing these flags in action gives a clear look at how TCP handles congestion. It shows how the protocol adapts to network issues to try and prevent packet loss. When the transfer ended, we saw the FIN flag, which normally means the connection is closing. However, the file did not finish transferring before we stopped the session. The last flag we saw was RST (Reset), which essentially tells the connection to "stop immediately."

![Wireshark RST](/assets/images/WiresharkRST.png)

Comparing images before and after the transfer, it was clear there was a drop in quality. This highlights how network issues can affect data transfer and the final result.

#### Before

![Mountain Image Before](/assets/images/MountainImageBefore.jpg)

#### After

![Mountain Image](/assets/images/MountainImage.jpg)

## Conclusion

In the end, this experiment provided valuable information on how TCP transmits data from one end to the other. And we also gained a great insight on what happens when something goes wrong. The network I was connected to did have some potential congestion and TCP recognized that and provided the proper flags to try to mitigate those issues. However, the transfer was doomed from the start. One thing I did not realize was that once I terminated the process, the JPEG image was all there, but just pixelated towards the bottom.
