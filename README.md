# grant-eligibility-checker
Green home grant scheme eligibility checker

# Collabrators
## Nithin
## Ramya

# Details
# First Time GitHub SSH Setup

# 1. Configure Git Identity
git config --global user.name "Nithin Sadanandan"
git config --global user.email "@gmail.com"

# Verify
git config --global --list

# 2. Generate SSH Key
ssh-keygen -t ed25519 -C "@gmail.com"

# Press Enter for all prompts

# 3. Start SSH Agent
eval "$(ssh-agent -s)"

# 4. Add SSH Key
ssh-add ~/.ssh/id_ed25519

# 5. Display Public Key
cat ~/.ssh/id_ed25519.pub

# 6. Copy the entire output and add it to:
# GitHub > Settings > SSH and GPG Keys > New SSH Key

# 7. Test SSH Connection
ssh -T git@github.com

# Expected Output
# Hi <username>! You've successfully authenticated.

# 8. Check Remote
git remote -v

# 9. Change HTTPS to SSH
git remote set-url origin git@github.com:ramya-athi/grant-eligibility-checker.git

# 10. Verify
git remote -v

# Expected
# origin git@github.com:ramya-athi/grant-eligibility-checker.git (fetch)
# origin git@github.com:ramya-athi/grant-eligibility-checker.git (push)
