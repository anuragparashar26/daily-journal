import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface JournalEntry {
    id: number;
    content: string;
    date: Date;
    category: string;
    mood: string;
    weather?: string;
    characterCount: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
    currentEntry: string = '';
    entries: JournalEntry[] = [];
    categories: string[] = ['Personal', 'Work', 'Travel', 'Family', 'Other'];
    moods: string[] = ['Happy', 'Sad', 'Excited', 'Anxious', 'Neutral'];
    selectedCategory: string = 'Personal';
    selectedMood: string = 'Neutral';
    searchTerm: string = '';
    maxLength: number = 500;
    isDarkMode: boolean = false;

    ngOnInit() {
        this.loadEntries();
        this.loadThemePreference();
    }

    addEntry() {
        if (this.currentEntry.trim()) {
            const newEntry: JournalEntry = {
                id: Date.now(),
                content: this.currentEntry,
                date: new Date(),
                category: this.selectedCategory,
                mood: this.selectedMood,
                characterCount: this.currentEntry.length,
                weather: 'Sunny'
            };
            this.entries.unshift(newEntry);
            this.saveEntries();
            this.resetForm();
        }
    }

    resetForm() {
        this.currentEntry = '';
        this.selectedCategory = 'Personal';
        this.selectedMood = 'Neutral';
    }

    deleteEntry(id: number) {
        this.entries = this.entries.filter(entry => entry.id !== id);
        this.saveEntries();
    }

    saveEntries() {
        localStorage.setItem('journal-entries', JSON.stringify(this.entries));
    }

    loadEntries() {
        const saved = localStorage.getItem('journal-entries');
        this.entries = saved ? JSON.parse(saved) : [];
    }

    getFilteredEntries() {
        return this.entries.filter(entry =>
            entry.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            entry.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            entry.mood.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    getRemainingCharacters(): number {
        return this.maxLength - this.currentEntry.length;
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('dark-mode', JSON.stringify(this.isDarkMode));
    }

    private loadThemePreference() {
        const savedTheme = localStorage.getItem('dark-mode');
        this.isDarkMode = savedTheme ? JSON.parse(savedTheme) : false;
        if (this.isDarkMode) {
            document.body.classList.add('dark-theme');
        }
    }
}
