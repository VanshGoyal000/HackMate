class AIMatcher {
    static calculateMatchScore(searchQuery, userProfile) {
        let score = 0;
        const queryTerms = searchQuery.toLowerCase().split(' ');
        
        // Convert profile data to searchable format
        const profileText = `
            ${userProfile.skills.join(' ')}
            ${userProfile.bio}
            ${userProfile.projects.map(p => `${p.title} ${p.description} ${p.techStack.join(' ')}`).join(' ')}
            ${userProfile.interests.join(' ')}
        `.toLowerCase();

        // Check for exact matches
        queryTerms.forEach(term => {
            if (profileText.includes(term)) {
                score += 10;
            }
        });

        // Skill matching (weighted higher)
        queryTerms.forEach(term => {
            if (userProfile.skills.some(skill => 
                skill.toLowerCase().includes(term)
            )) {
                score += 20;
            }
        });

        // Project matching
        userProfile.projects.forEach(project => {
            queryTerms.forEach(term => {
                if (project.techStack.some(tech => 
                    tech.toLowerCase().includes(term)
                )) {
                    score += 15;
                }
            });
        });

        return score;
    }

    static findMatches(searchQuery, users, limit = 4) {
        const scoredUsers = users.map(user => ({
            user,
            score: this.calculateMatchScore(searchQuery, user.profile)
        }));

        return scoredUsers
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(({ user }) => user);
    }
}

module.exports = AIMatcher;
