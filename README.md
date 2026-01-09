# 🗳️ Poll Booth  
### Community-Based Blockchain E-Voting System

Poll Booth is a **secure, community-driven e-voting platform** that enables transparent, tamper-proof, and privacy-preserving voting using **Blockchain technology**.  
It allows users to form trusted communities, conduct verified voting events, and store votes immutably on the blockchain while keeping voter identities anonymous.

---

## 📌 Problem Statement

Traditional voting systems face several challenges:

- Vote manipulation and election fraud  
- Centralized control and lack of transparency  
- Low trust in digital voting platforms  
- Privacy risks in electronic voting  

These issues reduce confidence in elections conducted for organizations, institutions, and public decision-making.

---

## 💡 Solution Overview

Poll Booth solves these problems by introducing:

- **Community-based voting**
- **Identity-verified yet anonymous voting**
- **Blockchain-backed vote storage**
- **Admin-controlled election management**

The system uses a **hybrid architecture**, storing sensitive user data off-chain while recording votes on-chain for maximum security and integrity.

---

## 🧠 Core Concept: Community-Based Voting

### 👥 Communities
- Any user can create an account on Poll Booth
- Users can create or join **communities**
- A community represents an organization or group
- Community creation follows **specific verification rules** to restrict fake users

### 👑 Admin Model
- The creator of a community becomes the **Community Admin**
- Only admins can:
  - Create voting events
  - Manage community members
  - Configure voting rules

### 📢 Voting Events
- Voting events are created **within communities**
- All community members are notified when a poll is created
- Only community members can participate in that poll

---

## 🌍 Public Events & Surveys

Poll Booth also supports **public voting events and surveys**:

- Eligible users can participate based on defined norms
- Users with special privileges can create public events
- Useful for surveys, opinion polls, and public decision-making

---

## 🔐 Voting & Identity Verification

- Users are verified before voting
- Identity verification happens **off-chain**
- Each user can vote **only once per event**
- Votes remain completely **anonymous**

> Identity is verified, but the vote is never linked to the voter.

---

## 🔗 Role of Blockchain

Blockchain is used as a **tamper-proof digital ballot box**.

- Votes are recorded as immutable blockchain transactions
- Once recorded, votes cannot be changed or deleted
- Ensures transparency, integrity, and trust

Blockchain is used **only for voting**, not for storing personal user data.

---

## 🧾 Smart Contracts

Smart contracts handle:

- Voting rules enforcement
- One-vote-per-user validation
- Election start and end control
- Automatic vote counting

This removes manual intervention and prevents result manipulation.

---

## ⚙️ System Architecture (Hybrid Model)

| Component | Technology |
|--------|-----------|
| User Authentication | Firebase Authentication |
| Community Management | Backend (Firestore) |
| Identity Verification | Off-chain |
| Vote Storage | Blockchain |
| Voting Logic | Smart Contracts |
| Result Display | Application UI |

---

## 🧪 Key Features

- Secure user authentication  
- Community-based voting structure  
- Admin-controlled voting events  
- Identity-verified anonymous voting  
- Blockchain-based immutable vote storage  
- Automatic vote counting  
- Transparent and auditable results  
- Real-time notifications  

---

## ☁️ Technologies Used

- Google Cloud Platform  
- Firebase Authentication  
- Firebase Firestore  
- Cloud Functions  
- Blockchain (Ethereum / compatible networks)  
- Smart Contracts  

---

## 💰 Cost Efficiency

- Development uses free-tier cloud services
- Blockchain test networks used during development
- In production, cost depends on number of votes
- Supports Layer-2 networks to reduce gas fees

---

## 🚀 Future Enhancements

- Biometric & OTP-based authentication  
- Smart contract-based advanced analytics  
- Zero-Knowledge Proof-based public verification  
- AI-based fraud detection  
- Multi-language and accessibility support  
- Device and IP rate limiting  

---

## 📂 Project Resources

- **GitHub Repository:**  
  https://github.com/DilipVelayutham/Blockchain-Based-E-Voting-System  

- **Demo Video:**  
  https://drive.google.com/file/d/1zP9YJYgEX7tbw0VzK-_ENvL74wVpruXB/view  

---

## 🏁 Conclusion

Poll Booth is designed to bring **trust, transparency, and privacy** to digital voting.  
By combining **community governance** with **blockchain immutability**, it provides a reliable and scalable solution for modern e-voting needs.

---

## 👨‍💻 Team

**Team Name:** Tech Dynamos  
**Team Lead:** Diyanesh T  

---

> “Poll Booth transforms voting into a secure, transparent, and community-driven digital experience.”
