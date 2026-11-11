#include <stdio.h>
#include <stdlib.h>

const int PLAYER_COUNT = 428;
const int LAST_MARBLE = 7206100;

struct Marble {
    int value;
    struct Marble* next;
    struct Marble* previous;
};
void printCircle(struct Marble* currentPosition, int marbleCount, int currentPlayer);

int main() {
    long scores[PLAYER_COUNT] = {};
    struct Marble *marbles = malloc((LAST_MARBLE + 1) * sizeof(struct Marble));

    struct Marble firstMarble = {0};
    marbles[0] = firstMarble;
    marbles[0].next = &marbles[0];
    marbles[0].previous = &marbles[0];
    struct Marble *currentPosition = &marbles[0];
    int marbleCount = 1;

    int currentPlayer = 0;
    for (int i = 1; i <= LAST_MARBLE; i++) {
        if (i % 23 == 0) {
            scores[currentPlayer] += i;
            struct Marble *removedMarble = currentPosition;
            for (int j = 0; j < 7; j++) {
                removedMarble = removedMarble->previous;
            }
            currentPosition = removedMarble->next;
            currentPosition->previous = removedMarble->previous;
            removedMarble->previous->next = currentPosition;
            scores[currentPlayer] += removedMarble->value;
            if (scores[currentPlayer] < 0) {
                printf("%d", i);
                exit(-1);
            }
            
            currentPlayer = (currentPlayer + 1) % PLAYER_COUNT;
            continue;
        }

        struct Marble *left = currentPosition->next;
        struct Marble *right = left->next;

        struct Marble marble = {i, right, left};
        marbles[i] = marble;
        (marble.previous)->next = &marbles[i];
        (marble.next)->previous = &marbles[i];
        currentPosition = &marbles[i];
        marbleCount++;
        // printf("currentPosition: %p, previous: %p, next: %p\n", currentPosition, currentPosition->previous, currentPosition->next);
        

        // printCircle(currentPosition, marbleCount, currentPlayer);
        currentPlayer = (currentPlayer + 1) % PLAYER_COUNT;
        // printf("marble_i: %d, player: %d\n", marble.value, currentPlayer);
    }

    long highScore = 0;
    for (int i = 0; i < PLAYER_COUNT; i++) {
        if (scores[i] > highScore) {
            highScore = scores[i];
        }
    }
    printf("high score: %lu\n", highScore);
    return 0;
}

void printCircle(struct Marble* currentPosition, int marbleCount, int currentPlayer) {
    struct Marble *marble = currentPosition;

    for (int i = 0; i < marbleCount - 1; i++) {
        marble = marble->next;
        printf(" %d ", marble->value);
        // printf(" %p %p", marble, marble->next);
    }

    printf("\n");
}